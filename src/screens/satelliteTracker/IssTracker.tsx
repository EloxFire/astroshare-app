import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
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
import { app_colors } from '../../helpers/constants'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import { degToRad } from 'three/src/math/MathUtils'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
import { getNextIssPasses, IssPass } from '../../helpers/scripts/utils/satellites/getNextIssPasses'
import { useSettings } from '../../contexts/AppSettingsContext'
import IssPassCard from '../../components/cards/IssPassCard'
import { isNight } from '@observerly/astrometry'

export default function IssTracker({ navigation }: any) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()

  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const issMeshRef = useRef<THREE.Points | null>(null);
  
  const earthRadius = 6371;  // Earth radius in km
  
  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [issTle, setIssTle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [focusIss, setFocusIss] = useState(true)

  const [issPasses, setIssPasses] = useState<IssPass[]>([])

  const mapRef = useRef(null)
  const youtubePlayerRef = useRef(null)
  
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
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }, [loading])

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

      // const passes: IssPass[] = getNextIssPasses(currentUserLocation.lat, currentUserLocation.lon, 341, [tle.data.data.line1.trim(), tle.data.data.line2.trim()])
      // if(passes){
      //   setIssPasses(passes)
      // }else {
      //   setIssPasses([])
      // }
      

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
              <View style={starlinkTrackerStyles.content.glviewContainer}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.3dMap.title')}</Text>
                <GestureDetector gesture={pan}>
                  <GLView style={starlinkTrackerStyles.content.glviewContainer.glview} onContextCreate={_onContextCreate} />
                </GestureDetector>
                <ToggleButton title={i18n.t('satelliteTracker.issTracker.3dMap.button')} toggled={focusIss} onToggle={() => setFocusIss(!focusIss)} />
              </View>
              <View style={issTrackerStyles.content.mapContainer}> 
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.2dMap.title')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <SimpleButton text={i18n.t('satelliteTracker.issTracker.2dMap.button')} onPress={centerIss} icon={require('../../../assets/icons/FiIss.png')} />
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
              {/* <View style={issTrackerStyles.content.nextPasses}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.nextPasses.title')}</Text>
                {
                  issPasses.length > 0 ?
                  issPasses.map((pass, index) => {
                    if(isNight(new Date(pass.startTime), {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon})){
                      return <IssPassCard key={index} pass={pass} navigation={navigation} />
                    }
                  })
                  :
                  <Text>Pas de passage à votre position dans les 48 prochaines heures</Text>
                }
              </View> */}
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}