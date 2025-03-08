import React, { useEffect, useRef, useState } from 'react'
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import axios from 'axios'
import PageTitle from '../../components/commons/PageTitle'
import {app_colors, storageKeys} from '../../helpers/constants'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import { degToRad } from 'three/src/math/MathUtils'
import ToggleButton from '../../components/commons/buttons/ToggleButton'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import DSOValues from '../../components/commons/DSOValues'
import { shortDmsCoord } from '../../helpers/scripts/shortenDmsCoord'
import getCountryFlag from 'country-flag-icons/unicode'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import { mapStyle } from '../../helpers/mapJsonStyle'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import {useLaunchData} from "../../contexts/LaunchContext";
import {LaunchData} from "../../helpers/types/LaunchData";
import LaunchCard from "../../components/cards/LaunchCard";
import {getObject, storeObject} from "../../helpers/storage";
import IssPassCard from "../../components/cards/IssPassCard";
import {useSettings} from "../../contexts/AppSettingsContext";
import {IssPass} from "../../helpers/types/IssPass";
import dayjs from "dayjs";
import {getWeather} from "../../helpers/api/getWeather";
import {conjunctionCardStyles} from "../../styles/components/cards/conjunctionCard";
import {routes} from "../../helpers/routes";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import {useAuth} from "../../contexts/AuthContext";
import { propagate, twoline2satrec, gstime, EciVec3 } from "satellite.js";

export default function IssTracker({ navigation }: any) {

  const {currentLocale} = useTranslation()
  const {launchData} = useLaunchData()
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()


  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);

  const earthRadius = 6371;  // Earth radius in km

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [issTle, setIssTle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [focusIss, setFocusIss] = useState(true)
  const [passesWeather, setPassesWeather] = useState<any[]>([])

  const [issPassesLoading, setIssPassesLoading] = useState(true)
  const [issPasses, setIssPasses] = useState<IssPass[]>([])
  const mapRef = useRef(null)

  const focusIssRef = useRef(focusIss);

  useEffect(() => {
    focusIssRef.current = focusIss;
  }, [focusIss]);

  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
      updateIssPosition(focusIssRef.current)
    }, 5000)

    return () => clearInterval(update)
  }, [])

  useEffect(() => {
    handleIssPasses()
  }, [currentUserLocation])

  useEffect(() => {
    // Get weather for the pass
    if(!currentUserLocation) return;
    (async () => {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setPassesWeather(weather.daily)
      console.log(weather.daily[6].weather[0])
    })()
  }, [currentUserLocation])

  useEffect(() => {
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }, [loading])

  const handleIssPasses = async () => {
    console.log('Handling ISS passes')
    const storedPasses = await getObject(storageKeys.issPasses);

    if(storedPasses){
      console.log("Found ISS passes in Local Storage")
      const parsedPasses = JSON.parse(storedPasses);
      const areSomePassesOver = parsedPasses.passes.some((pass: IssPass) => dayjs.unix(pass.endUTC) < dayjs());

      if(areSomePassesOver){
        console.log('Some passes are over, fetching new passes')
        fetchIssPasses()
      }else{
        console.log('Restoring passes from local storage')
        setIssPasses(parsedPasses.passes)
        setIssPassesLoading(false)
      }
    }else{
      fetchIssPasses()
    }
  }

  const fetchIssPasses = async () => {
    if(!currentUserLocation) return
    try {
      console.log('Fetching ISS passes API')
      const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/passes`, {
        params: {
          latitude: currentUserLocation.lat,
          longitude: currentUserLocation.lon,
          altitude: 0
        }
      })
      setIssPasses(response.data.passes)
      console.log('Storing ISS passes in local storage')
      await storeObject(storageKeys.issPasses, JSON.stringify(response.data))
      setIssPassesLoading(false)
    } catch (error) {
      console.log(`[iss] Error fetching ISS passes: ${error}`)
      setIssPassesLoading(false)
    }
  }

  const getIssData = async () => {
    try {
      const position = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      const trajectoryPoints = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/trajectory`)
      const name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });
      const tle = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

      const iss = {
        ...position.data.data,
        dms_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dms_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country
      }


      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
      const fortmatedTle = [tle.data.data.header.trim(), tle.data.data.line1.trim(), tle.data.data.line2.trim()]
      setIssTle(fortmatedTle)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // La fonction pour charger la texture de la Terre
  const loadAndProcessAsset = async () => {
    try {
      // Charger l'asset de la texture
      const asset = Asset.fromModule(require('../../../assets/images/textures/earth_night.jpg'));
      if (!asset.localUri) {
        await asset.downloadAsync();
      }

      const { width, height } = asset;
      const localUri = `${FileSystem.cacheDirectory}copied_texture.png`;
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        await FileSystem.copyAsync({ from: asset.localUri!, to: localUri });
      }

      const copiedAsset = Asset.fromURI(`${localUri}`);
      copiedAsset.height = height;
      copiedAsset.width = width;
      copiedAsset.localUri = localUri;

      return ExpoTHREE.loadAsync(copiedAsset);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'asset :', error);
    }
  };

  function isEciVec3(obj: any): obj is EciVec3<number> {
    return obj && typeof obj.x === "number" && typeof obj.y === "number" && typeof obj.z === "number";
  }

  const calculateOrbitPoints = (tle: string[], earthRadius: number): THREE.Vector3[] => {
    const satrec = twoline2satrec(tle[0], tle[1]); // Convert TLE to satellite record
    const numPoints = 500; // Augmenter le nombre de points pour plus de densité
    const points: THREE.Vector3[] = [];
    const periodMinutes = (1440 / satrec.no); // Orbital period in minutes
    const stepMinutes = periodMinutes / numPoints; // Time step for each point

    for (let i = 0; i <= numPoints; i++) {
      const time = new Date(); // Current time
      time.setMinutes(time.getMinutes() + i * stepMinutes);

      const positionAndVelocity = propagate(satrec, time);

      if (positionAndVelocity && isEciVec3(positionAndVelocity.position)) {
        const { x, y, z } = positionAndVelocity.position;

        // Convert to THREE.js coordinates
        const scale = earthRadius / 6378.137; // Scale from satellite.js (Earth radius in km)
        const point = new THREE.Vector3(x * scale, z * scale, -y * scale);
        points.push(point);
      }
    }

    return points;
  };

  const addOrbitPoints = (scene: THREE.Scene, points: THREE.Vector3[]) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);

    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff0000, // Red color
      size: 20, // Taille des points
    });

    const pointsObject = new THREE.Points(geometry, material);
    scene.add(pointsObject);
  };

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000);
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    camera.position.set(0, 0, 11500);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Charger la texture de la Terre
    const earthTexture = await loadAndProcessAsset();
    if (earthTexture) {
      const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);
      const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);

      earth.rotation.y = degToRad(-90);
      scene.add(earth);
      earthMeshRef.current = earth;
    }

    // console.log('Loading ISS trajectory points...');
    // const tle: any = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)
    //
    // // Ajouter la trajectoire orbitale
    // if (tle.data.data) {
    //   console.log('Calculating ISS orbit points...');
    //   const orbitPoints = calculateOrbitPoints([tle.data.data.line1, tle.data.data.line2], earthRadius);
    //   addOrbitPoints(scene, orbitPoints);
    // }

    updateIssPosition(focusIss);


    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };

    animate();
  };

  const updateCameraToFollowIss = (issLat: number, issLon: number) => {
    if (cameraRef.current) {
      const cameraOrbitDistance = 11500;  // Adjust the distance from the Earth's center for the camera's orbit
      const cameraX = cameraOrbitDistance * Math.cos(issLat) * Math.sin(issLon);
      const cameraZ = cameraOrbitDistance * Math.cos(issLat) * Math.cos(issLon);
      const cameraY = cameraOrbitDistance * Math.sin(issLat);  // Adjust the camera height according to the latitude

      // Set the camera's position to orbit above the ISS
      cameraRef.current.position.set(cameraX, cameraY, cameraZ);

      // Ensure the camera still looks at the center of the Earth
      cameraRef.current.lookAt(0, 0, 0);
    }
  }

  const updateIssPosition = async (doesIssNeedFocus: boolean) => {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)
    const tle = [response.data.data.header.trim(), response.data.data.line1.trim(), response.data.data.line2.trim()]

    const issGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(3);

    // Récupérer les coordonnées du satellite
    if(tle){
      const position = await getSatelliteCoordsFromTLE(tle);
      if (position) {
        const radius = earthRadius + position.altitude;

        // Convertir les angles de latitude et longitude de degrés en radians
        const latRad = position.latitude;
        const lonRad = position.longitude;

        // Calcul des coordonnées cartésiennes en utilisant les angles en radians
        const x = radius * Math.cos(latRad) * Math.sin(lonRad);
        const z = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);

        positions[0] = x;
        positions[1] = y;
        positions[2] = z;

        // Move the camera to orbit above the ISS, keeping its focus on the Earth's center
        if(doesIssNeedFocus === true){
          updateCameraToFollowIss(latRad, lonRad);
        }
      }
    }

    // Mettre à jour les attributs de la géométrie
    issGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    issGeometry.computeBoundingSphere(); // Optionnel pour améliorer les performances de rendu

    const satelliteMaterial = new THREE.PointsMaterial({ color: app_colors.red, size: 100 });
    const satelliteMesh = new THREE.Points(issGeometry, satelliteMaterial);

    // Si un ancien mesh de satellites existe, le retirer avant d'ajouter le nouveau
    const existingMesh = sceneRef.current?.children.find(child => child instanceof THREE.Points);
    if (existingMesh) {
      sceneRef.current?.remove(existingMesh);
    }

    if (sceneRef.current) {
      sceneRef.current.add(satelliteMesh);
    }
  };

  let oldX = 0.0, oldY = 0.0;
  let polarAngle = Math.PI / 2;  // Angle vertical (hauteur)
  let azimuthalAngle = 0;  // Angle horizontal (autour de l'axe Y)
  const rotationSpeed = 0.005;
  let distanceFromEarth = 11500;  // Distance fixe de la caméra par rapport à la Terre

  // Fonction pour mettre à jour la position de la caméra autour de la Terre
  const updateCameraPosition = (camera: THREE.PerspectiveCamera) => {
    const x = distanceFromEarth * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    const y = distanceFromEarth * Math.cos(polarAngle);
    const z = distanceFromEarth * Math.sin(polarAngle) * Math.sin(azimuthalAngle);

    camera.position.set(x, y, z);
    if(earthMeshRef.current){
      camera.lookAt(earthMeshRef.current.position);  // La caméra regarde toujours la Terre
    }
  };

  const pan = Gesture.Pan()
  .onStart(() => {
    // Initialize old coordinates for delta calculations
    oldX = 0;
    oldY = 0;
  })
  .onChange((e) => {
  const camera = cameraRef.current;

  if (camera) {
    // Calculate the delta movement from the previous touch point
    const deltaX = e.translationX - oldX;
    const deltaY = e.translationY - oldY;

    // Adjust the rotation speed based on the zoom level
    // Add a minimum threshold to avoid excessive sensitivity
    const adjustedRotationSpeed = Math.max(rotationSpeed * (11500 / distanceFromEarth), 0.00001);

    // Update angles based on the delta movement and adjusted rotation speed
    azimuthalAngle += deltaX * adjustedRotationSpeed;  // Horizontal rotation
    polarAngle -= deltaY * adjustedRotationSpeed;  // Vertical rotation

    // Constrain polarAngle to prevent the camera from going under or over the Earth
    polarAngle = Math.max(0.1, Math.min(Math.PI - 0.1, polarAngle));

    // Update the camera's position
    updateCameraPosition(camera);

    // Update old coordinates for the next gesture change event
    oldX = e.translationX;
    oldY = e.translationY;
  }
});

const centerIss = () => {
  if (!mapRef.current) return
  // @ts-ignore
  mapRef.current.animateToRegion({
    latitude: issPosition ? issPosition.latitude : 0,
    longitude: issPosition ? issPosition.longitude : 0,
    latitudeDelta: 0,
    longitudeDelta: 100,
  })
}

  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.home.buttons.issTracker.title')}
          subtitle={i18n.t('satelliteTracker.home.buttons.issTracker.subtitle')}
        />
          <View style={globalStyles.screens.separator} />
          <ScrollView>
            <View style={issTrackerStyles.content}>
              <View style={issTrackerStyles.content.liveStats}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.stats.title')}</Text>
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.latitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lat) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.longitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lon) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.altitude')} value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.speed')} value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.country')} value={issPosition ? `${getCountryByCode(issPosition.country, currentLocale)} - ${getCountryFlag(issPosition.country === i18n.t('satelliteTracker.issTracker.stats.unknown') ? 'ZZ' : issPosition.country )}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              </View>
              <View style={issTrackerStyles.content.nextPasses}>
                <Text style={issTrackerStyles.content.nextPasses.title}>{i18n.t('satelliteTracker.issTracker.nextPasses.title')}</Text>
                <Text style={issTrackerStyles.content.nextPasses.subtitle}>{i18n.t('satelliteTracker.issTracker.nextPasses.subtitle')}{currentUserLocation.common_name}</Text>
                {
                  !currentUser && !isProUser(currentUser) ?
                    <>
                      <View style={issTrackerStyles.content.nextPasses.container}>
                        {
                          issPassesLoading ?
                            <ActivityIndicator size={'small'} color={app_colors.white} animating /> :
                            issPasses.length > 0 ?
                              issPasses.slice(0, 4).map((pass: IssPass, index: number) => {
                                return (
                                  <IssPassCard pass={pass} navigation={navigation} key={index} passIndex={index} weather={passesWeather} />
                                )
                              }) : <SimpleButton text={i18n.t('satelliteTracker.issTracker.nextPasses.noPasses')} disabled fullWidth />
                        }
                        <SimpleButton
                          fullWidth
                          backgroundColor={app_colors.white}
                          textColor={app_colors.black}
                          textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                          align={'center'}
                          text={i18n.t('satelliteTracker.issTracker.nextPasses.seeMore')}
                          onPress={() => navigation.push(routes.satellitesTrackers.issPasses.path, {passes: issPasses, weather: passesWeather})}
                        />
                      </View>
                    </> :
                  <ProLocker navigation={navigation} image={require('../../../assets/images/tools/isstracker.png')}/>
                }

              </View>
              <View style={starlinkTrackerStyles.content.glviewContainer}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.3dMap.title')}</Text>
                <Text style={issTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTracker.issTracker.3dMap.subtitle')}</Text>
                <GestureDetector gesture={pan}>
                  <GLView style={starlinkTrackerStyles.content.glviewContainer.glview} onContextCreate={_onContextCreate} />
                </GestureDetector>
                <ToggleButton title={i18n.t('satelliteTracker.issTracker.3dMap.button')} toggled={focusIss} onToggle={() => setFocusIss(!focusIss)} />
              </View>
              <View style={issTrackerStyles.content.mapContainer}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.2dMap.title')}</Text>
                <Text style={issTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTracker.issTracker.2dMap.subtitle')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <SimpleButton
                    text={i18n.t('satelliteTracker.issTracker.2dMap.button')}
                    onPress={centerIss} icon={require('../../../assets/icons/FiIss.png')}
                    textColor={app_colors.white}
                    align={'center'}
                  />
                </View>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={issTrackerStyles.content.mapContainer.map}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: issPosition ? issPosition.latitude : 0,
                    longitude: issPosition ? issPosition.longitude : 0,
                    latitudeDelta: 0,
                    longitudeDelta: 1000,
                  }}
                  rotateEnabled={false}
                  cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
                >
                  {
                    issPosition &&
                    <Marker
                      coordinate={{
                        latitude: issPosition.latitude,
                        longitude: issPosition.longitude,
                      }}
                      title='ISS'
                      description="Position de l'ISS en temps réel"
                      image={require('../../../assets/icons/FiIssSmall.png')}
                      anchor={{ x: 0.5, y: 0.5 }}
                      centerOffset={{ x: 0.5, y: 0.5 }}
                    />

                  }
                  {
                    issPosition &&
                    <Circle
                      center={{
                        latitude: issPosition.latitude,
                        longitude: issPosition.longitude,
                      }}
                      radius={1200000}
                      fillColor={app_colors.white_twenty}
                      strokeColor={app_colors.white_forty}
                    />
                  }
                  {
                    trajectoryPoints &&
                    <Polyline
                      coordinates={trajectoryPoints}
                      strokeColor={app_colors.red}
                      strokeWidth={1}
                      geodesic
                    />
                  }
                </MapView>
              </View>

              <View style={issTrackerStyles.content.liveStats}>
                <Text style={[issTrackerStyles.content.liveStats.title, {marginBottom: 10}]}>{i18n.t('satelliteTracker.issTracker.nextLaunches.title')}</Text>
                {
                  launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).length > 0 ?
                  launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).map((launch: LaunchData, index: number) => {
                    return(
                      <LaunchCard launch={launch} navigation={navigation} key={index} />
                    )
                  })
                    :
                    <SimpleButton
                      text={i18n.t('satelliteTracker.issTracker.nextLaunches.noLaunches')}
                      disabled
                      fullWidth
                      textColor={app_colors.white}
                      align={'center'}
                    />
                }
              </View>
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}
