import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { mapStyle } from '../../helpers/mapJsonStyle'
import { app_colors } from '../../helpers/constants'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { Image } from 'expo-image'
import PageTitle from '../../components/commons/PageTitle'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import axios from 'axios'
import DSOValues from '../../components/commons/DSOValues'
import YoutubePlayer from "react-native-youtube-iframe";
import { i18n } from '../../helpers/scripts/i18n'
import { issFeedImages } from '../../helpers/scripts/loadImages'
import { useTranslation } from '../../hooks/useTranslation'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import { globalStyles } from '../../styles/global'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import { formatKm } from '../../helpers/scripts/utils/formatters/formaters'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'

export default function IssTracker({ navigation }: any) {


  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);

  const earthRadius = 6371;  // Earth radius in km

  const { currentLocale } = useTranslation()

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [issInfosModalVisible, setIssInfosModalVisible] = useState(false)
  const [liveFeedModalVisible, setLiveFeedModalVisible] = useState(false)
  const [issFeedError, setIssFeedError] = useState(false)

  const mapRef = useRef(null)
  const youtubePlayerRef = useRef(null)


  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
    }, 5000)

    return () => clearInterval(update)
  }, [])

  // useEffect(() => {
  //   if (!mapRef.current) return
  //   // @ts-ignore
  //   mapRef.current.animateToRegion({
  //     latitude: issPosition ? issPosition.latitude : 0,
  //     longitude: issPosition ? issPosition.longitude : 0,
  //     latitudeDelta: 0,
  //     longitudeDelta: 100,
  //   })
  // }, [loading])

  const getIssData = async () => {
    try {
      const position = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      const trajectoryPoints = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/trajectory`)

      let name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });

      const iss = {
        ...position.data.data,
        dsm_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dsm_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country
      }

      // console.log(iss);
      

      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // const centerIss = () => {
  //   if (!mapRef.current) return
  //   // @ts-ignore
  //   mapRef.current.animateToRegion({
  //     latitude: issPosition ? issPosition.latitude : 0,
  //     longitude: issPosition ? issPosition.longitude : 0,
  //     latitudeDelta: 0,
  //     longitudeDelta: 100,
  //   })
  // }

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    const issTLE = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

    // Initialisation de la scène, de la caméra et du renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000); // Grand "far" pour voir les satellites
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);

    // Positionner la caméra pour voir la Terre et les satellites
    camera.position.set(0, 0, 11500);

    // Stocker les références dans les refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Ajouter la Terre
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);
    const textureLoader = new ExpoTHREE.TextureLoader();
    const earthTexture = await textureLoader.loadAsync(require('../../../assets/images/textures/nasa_globe_flat.jpg'));
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    sceneRef.current.add(earth);

    earthMeshRef.current = earth;


    updateIssPosition([issTLE.data.data.header, issTLE.data.data.line1, issTLE.data.data.line2]);

    // Mettre a jour la position de l'iss toutes les 5 secondes
    const update = setInterval(() => {
      updateIssPosition([issTLE.data.data.header, issTLE.data.data.line1, issTLE.data.data.line2]);
    }, 5000);
    
    // Boucle d'animation pour rendre la scène
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };

    animate();
  };

  const updateIssPosition = async (issTLE: string[]) => {
    // Place the ISS in orbit around the Earth based on its latitude and longitude
    if (issTLE && sceneRef.current) {
      const coords = await getSatelliteCoordsFromTLE(issTLE);

      
      if(coords){
        const latRad = coords.latitude * Math.PI / 180;
        const lonRad = coords.longitude * Math.PI / 180;

        const x = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
        const z = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
        const y = earthRadius * Math.sin(latRad);

        console.log(x, y, z);
        
        const position = new THREE.Vector3(x, y, z);
        const issGeometry = new THREE.SphereGeometry(20, 32, 32);
        const issMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const iss = new THREE.Mesh(issGeometry, issMaterial);
        iss.position.set(position.x, position.y, position.z);
        sceneRef.current.add(iss);
      }
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
            <View style={starlinkTrackerStyles.content}>
              <View style={starlinkTrackerStyles.content.statsContainer}>
                <Text style={globalStyles.sections.title}>ISS</Text>
                <View style={starlinkTrackerStyles.content.statsContainer.stats}>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Altitude (Km)</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{Math.round(issPosition?.altitude)}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Vitesse (Km/h)</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{issPosition?.velocity.toFixed(2)}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Pays</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{getCountryByCode(issPosition?.country)}</Text>
                  </View>
                </View>
              </View>
              <View style={starlinkTrackerStyles.content.glviewContainer}>
                <GestureDetector gesture={pan}>
                  <GLView style={starlinkTrackerStyles.content.glviewContainer.glview} onContextCreate={_onContextCreate} />
                </GestureDetector>
              </View>
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )

  // return (
  //   <View>
  //     <MapView
  //       ref={mapRef}
  //       provider={PROVIDER_GOOGLE}
  //       style={issTrackerStyles.map}
  //       customMapStyle={mapStyle}
  //       initialRegion={{
  //         latitude: issPosition ? issPosition.latitude : 0,
  //         longitude: issPosition ? issPosition.longitude : 0,
  //         latitudeDelta: 0,
  //         longitudeDelta: 100,
  //       }}
  //       rotateEnabled={false}
  //     >
  //       {
  //         issPosition &&
  //         <Marker
  //           coordinate={{
  //             latitude: issPosition.latitude,
  //             longitude: issPosition.longitude,
  //           }}
  //           title='ISS'
  //           description="Position de l'ISS en temps réel"
  //           image={require('../../../assets/icons/FiIssSmall.png')}
  //           anchor={{ x: 0.5, y: 0.5 }}
  //           centerOffset={{ x: 0.5, y: 0.5 }}
  //         />

  //       }
  //       {
  //         issPosition &&
  //         <Circle
  //           center={{
  //             latitude: issPosition.latitude,
  //             longitude: issPosition.longitude,
  //           }}
  //           radius={1200000}
  //           fillColor={app_colors.white_twenty}
  //           strokeColor={app_colors.white_forty}
  //         />
  //       }
  //       {
  //         trajectoryPoints &&
  //         <Polyline
  //           coordinates={trajectoryPoints}
  //           strokeColor={app_colors.red}
  //           strokeWidth={1}
  //           geodesic
  //         />
  //       }
  //     </MapView>
  //     <View style={issTrackerStyles.pageControls}>
  //       <PageTitle title={i18n.t('home.buttons.satellite_tracker.title')} navigation={navigation} subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')} />
  //     </View>
  //     <View style={issTrackerStyles.buttons}>
  //       <TouchableOpacity style={issTrackerStyles.buttons.button} onPress={() => { setLiveFeedModalVisible(false); setIssInfosModalVisible(!issInfosModalVisible) }}>
  //         <Image source={require('../../../assets/icons/FiInfo.png')} style={{ width: 18, height: 18 }} />
  //         <Text style={issTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.infos')}</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={issTrackerStyles.buttons.button} onPress={() => centerIss()}>
  //         <Image source={require('../../../assets/icons/FiIss.png')} style={{ width: 18, height: 18 }} />
  //         <Text style={issTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.center')}</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={issTrackerStyles.buttons.button} onPress={() => handleLiveFeedDisplay()}>
  //         {
  //           !liveFeedModalVisible ?
  //             <Image source={require('../../../assets/icons/FiPlayCircle.png')} style={{ width: 18, height: 18 }} />
  //             :
  //             <Image source={require('../../../assets/icons/FiStopCircle.png')} style={{ width: 18, height: 18 }} />
  //         }
  //         <Text style={issTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.feed')}</Text>
  //       </TouchableOpacity>
  //     </View>
  //     {
  //       issInfosModalVisible &&
  //       <View style={issTrackerStyles.issModal}>
  //         <ScrollView>
  //           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
  //             <View>
  //               <Text style={issTrackerStyles.issModal.title}>{i18n.t('satelliteTracker.issTracker.infosModal.title')}</Text>
  //               <Text style={issTrackerStyles.issModal.subtitle}>{i18n.t('satelliteTracker.issTracker.infosModal.subtitle')}</Text>
  //             </View>
  //             <Image source={require('../../../assets/icons/FiIss.png')} style={{ width: 50, height: 50 }} />
  //           </View>
  //           <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.latitude')} value={issPosition ? issPosition.dsm_lat : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
  //           <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.longitude')} value={issPosition ? issPosition.dsm_lon : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
  //           <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.altitude')} value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
  //           <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.speed')} value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
  //           <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.country')} value={issPosition ? getCountryByCode(issPosition.country) : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
  //         </ScrollView>
  //       </View>
  //     }

  //     {
  //       liveFeedModalVisible &&
  //       <View style={issTrackerStyles.issModal}>
  //         <ScrollView>
  //           <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  //             <View style={issTrackerStyles.issModal.liveDot} />
  //             <Text style={issTrackerStyles.issModal.title}>{i18n.t('satelliteTracker.issTracker.liveModal.title')}</Text>
  //           </View>
  //           <Text style={[issTrackerStyles.issModal.subtitle, { marginBottom: 10, fontFamily: 'GilroyRegular', opacity: .5 }]}>{i18n.t('satelliteTracker.issTracker.liveModal.subtitle')}</Text>
  //           {
  //             issFeedError ?
  //               <Image source={issFeedImages[i18n.locale]} style={{ width: '100%', height: 220, borderRadius: 10, borderWidth: 1, borderColor: app_colors.white_twenty }} />
  //               :
  //               <YoutubePlayer
  //                 width={Dimensions.get('screen').width - 20}
  //                 height={(Dimensions.get('screen').width - 20) / (16 / 9)}
  //                 play
  //                 ref={youtubePlayerRef}
  //                 videoId={"bZ4nAEhwoCI"}
  //                 onError={() => setIssFeedError(true)}
  //               />
  //           }
  //         </ScrollView>
  //       </View>
  //     }
  //   </View>
  // )
}