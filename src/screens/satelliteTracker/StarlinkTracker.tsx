import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { i18n } from '../../helpers/scripts/i18n'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { StarlinkSatellite } from '../../helpers/types/StarlinkSatellite'
import PageTitle from '../../components/commons/PageTitle'
import axios from 'axios'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import { app_colors } from '../../helpers/constants'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSpacex } from '../../contexts/SpaceXContext'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import dayjs from 'dayjs'
import { getLaunchStatus } from '../../helpers/scripts/astro/launchApi/getLaunchStatus'
import { degToRad } from 'three/src/math/MathUtils'
import DSOValues from '../../components/commons/DSOValues'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import { Asset } from 'expo-asset';

export default function StarlinkTracker({ navigation }: any) {

  const { constellation, nextStarlinkLaunches} = useSpacex()

  const [launchDetails, setLaunchDetails] = useState<number>(-1)

  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);

  const earthRadius = 6371;  // Earth radius in km


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
  
    // Initialisation de la scène, de la caméra et du renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000);
    const renderer = new ExpoTHREE.Renderer({ gl });
  
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    camera.position.set(0, 0, 11500);
  
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;
  
    // Preload texture using Expo Asset
    const earthTextureAsset = Asset.fromModule(require('../../../assets/images/textures/earth_night.jpg'));
    await earthTextureAsset.downloadAsync();
  
    // Load the texture after it is preloaded
    const textureLoader = new ExpoTHREE.TextureLoader();
    const earthTexture = await textureLoader.loadAsync(earthTextureAsset.localUri || earthTextureAsset.uri);
  
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    sceneRef.current.add(earth);
    earth.rotation.y = degToRad(-90);
  
    earthMeshRef.current = earth;
  
    // Mise à jour des positions des satellites
    updateSatellitesPosition(constellation.satellites);
    
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };
  
    animate();
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

  const updateSatellitesPosition = async (satellites: StarlinkSatellite[]) => {
    const satelliteGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(satellites.length * 3);
  
    // Remplir le tableau positions avec les coordonnées calculées
    await Promise.all(satellites.map(async (satellite: StarlinkSatellite, index: number) => {
      if (satellite.TLE) {
        const position = await getSatelliteCoordsFromTLE(satellite.TLE);
        if (position) {
          const radius = earthRadius + position.altitude;
  
          const x = radius * Math.cos(position.latitude) * Math.sin(position.longitude);
          const z = radius * Math.cos(position.latitude) * Math.cos(position.longitude);
          const y = radius * Math.sin(position.latitude);
  
          positions[index * 3] = x;
          positions[index * 3 + 1] = y;
          positions[index * 3 + 2] = z;
        }
      }
    }));
  
    // Mettre à jour les attributs de la géométrie
    satelliteGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    satelliteGeometry.computeBoundingSphere(); // Optionnel, pour améliorer les performances de rendu
  
    const satelliteMaterial = new THREE.PointsMaterial({ color: app_colors.red, size: 15 });
    const satelliteMesh = new THREE.Points(satelliteGeometry, satelliteMaterial);
  
    // Si un ancien mesh de satellites existe, le retirer avant d'ajouter le nouveau
    const existingMesh = sceneRef.current?.children.find(child => child instanceof THREE.Points);
    if (existingMesh) {
      sceneRef.current?.remove(existingMesh);
    }
  
    if (sceneRef.current) {
      sceneRef.current.add(satelliteMesh);
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

  // Ajout du zoom
  const zoom = Gesture.Pinch()
  .onChange((e) => {
    const camera = cameraRef.current;

    if (camera) {
      const zoomFactor = 0.01; // Adjust this value to make the zoom less sensitive
      distanceFromEarth *= 1 - (e.scale - 1) * zoomFactor;

      // Contrainte sur la distance pour éviter de rentrer dans la Terre
      distanceFromEarth = Math.max(8000, Math.min(22000, distanceFromEarth));

      updateCameraPosition(camera);
    }
  });

  const gestures = Gesture.Simultaneous(zoom, pan);


  const handleLauncgDetails = (index: number) => {
    if(launchDetails === index){
      setLaunchDetails(-1)
    }else{
      setLaunchDetails(index)
    }
  }

  // FOR FUTURE USE
  // const handleLiveTracking = () => {

  //   if(liveTrackInterval.current){
  //     clearInterval(liveTrackInterval.current)
  //     liveTrackInterval.current = null
  //   }

  //   const interval = setInterval(() => {
  //     updateSatellitesPosition(constellation.satellites);
  //   }, 2500)

  //   liveTrackInterval.current = interval;
  // }


  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.starlinkTracker.title')}
          subtitle={i18n.t('satelliteTracker.starlinkTracker.subtitle')}
        />
          <View style={globalStyles.screens.separator} />
          <ScrollView>
            <View style={starlinkTrackerStyles.content}>
              <View style={starlinkTrackerStyles.content.statsContainer}>
                <Text style={[globalStyles.sections.title, {fontSize: 20, marginBottom: 10}]}>{i18n.t('satelliteTracker.starlinkTracker.stats.title')}</Text>
                <DSOValues title={i18n.t('satelliteTracker.starlinkTracker.stats.total')} value={constellation.satellites.length + constellation.satcat_missing_tle.length} />
                <DSOValues title={i18n.t('satelliteTracker.starlinkTracker.stats.active')} value={constellation.satellites.filter((satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE).length} />
                <DSOValues title={i18n.t('satelliteTracker.starlinkTracker.stats.inactive')} value={constellation.satcat_missing_tle.length} />
              </View>
                <View style={starlinkTrackerStyles.content.glviewContainer}>
                  <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.starlinkTracker.3dMap.title')}</Text>
                  <SimpleButton small icon={require('../../../assets/icons/FiRepeat.png')} text={i18n.t('satelliteTracker.starlinkTracker.3dMap.button')} onPress={() => updateSatellitesPosition(constellation.satellites)} />
                  <GestureDetector gesture={gestures}>
                    <GLView style={[starlinkTrackerStyles.content.glviewContainer.glview, {marginTop: 10}]} onContextCreate={_onContextCreate} />
                  </GestureDetector>
                </View>
              <View style={starlinkTrackerStyles.content.launches}>
                <Text style={globalStyles.sections.title}>{i18n.t('satelliteTracker.starlinkTracker.launches.title')}</Text>
                <View style={starlinkTrackerStyles.content.launches.list}>
                  {
                    nextStarlinkLaunches.length > 0 ?
                    nextStarlinkLaunches.map((launch: any, launch_index: number) => (
                      <View key={launch_index} style={starlinkTrackerStyles.content.launches.list.launch}>
                        <Text style={starlinkTrackerStyles.content.launches.list.launch.title}>{launch.name.split('|')[1].trim()}</Text>
                        <View style={starlinkTrackerStyles.content.launches.list.launch.infos}>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.status')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{getLaunchStatus(launch.status.id)}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.date')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{dayjs(launch.net).format('DD/MM/YYYY')}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.launcher')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.rocket.configuration.name}</Text>
                          </View>
                        </View>
                        {
                          launchDetails === launch_index &&
                          <View style={starlinkTrackerStyles.content.launches.list.launch.moreInfos}>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.weather')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.weather_concerns ? "À surveiller" : "OK"}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.orbit')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.mission.orbit.abbrev}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.type')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.launch_service_provider.type}</Text>
                            </View>
                          </View>
                        }
                        <View style={{marginTop: 10}}>
                          <SimpleButton small text={launch_index === launchDetails ? i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.less') : i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.more')} onPress={() => handleLauncgDetails(launch_index)} />
                        </View>
                      </View>
                    ))
                    :
                    <SimpleButton disabled text={i18n.t('satelliteTracker.starlinkTracker.launches.empty')} />
                  }
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}