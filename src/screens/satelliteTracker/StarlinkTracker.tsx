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
import { getEffectiveAngularResolution } from '../../helpers/scripts/astro/skymap/getEffectiveAngularResolution'
import { useSpacex } from '../../contexts/SpaceXContext'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import dayjs from 'dayjs'
import { getLaunchStatus } from '../../helpers/scripts/astro/launchApi/getLaunchStatus'

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
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000); // Ajout d'un far grand
    const renderer = new ExpoTHREE.Renderer({ gl });
  
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
  
    // Ajuste la caméra pour qu'elle soit un peu plus éloignée afin de voir la Terre et les satellites
    camera.position.set(0, 0, 11500);
  
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;
  
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);
    const textureLoader = new ExpoTHREE.TextureLoader();
    const earthTexture = await textureLoader.loadAsync(require('../../../assets/images/textures/nasa_globe_flat.jpg'));
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    sceneRef.current.add(earth);
  
    earthMeshRef.current = earth;
    
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
    // Satellite geometry (agrandi pour être visible)
    const satelliteGeometry = new THREE.SphereGeometry(15, 32, 32);  // Taille temporaire plus grande
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: app_colors.red });
  
    // Utilisation d'InstancedMesh pour afficher plusieurs satellites
    const instanceCount = constellation.satellites.length; // Nombre de satellites affichés  
    const instanceMesh = new THREE.InstancedMesh(satelliteGeometry, satelliteMaterial, instanceCount);
  
    const matrix = new THREE.Matrix4();
  
    satellites.forEach(async (satellite: StarlinkSatellite, index: number) => {
      if (satellite.TLE) {
        const position = await getSatelliteCoordsFromTLE(satellite.TLE);
        if (!position) return;
  
        // Utiliser le rayon de la Terre et l'altitude pour positionner correctement les satellites
        const radius = earthRadius + position.altitude; // Calcul de la distance en fonction de l'altitude
  
        // Conversion des coordonnées sphériques en cartésiennes
        const x = radius * Math.cos(position.latitude) * Math.cos(position.longitude);
        const y = radius * Math.sin(position.latitude);
        const z = radius * Math.cos(position.latitude) * Math.sin(position.longitude);
  
        // Réinitialisation de la matrice avant de définir la position
        matrix.identity();
        matrix.setPosition(x, y, z);
        instanceMesh.setMatrixAt(index, matrix);
      }
  
      // Nécessaire pour que l'InstancedMesh sache qu'il doit mettre à jour les matrices
      instanceMesh.instanceMatrix.needsUpdate = true;
    });

    if(sceneRef.current) {
      sceneRef.current.add(instanceMesh);
    }else{
      console.log('sceneRef.current is null')
    }
  }
  
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
                <Text style={globalStyles.sections.title}>Constellation</Text>
                <View style={starlinkTrackerStyles.content.statsContainer.stats}>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.total')}</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{constellation.satellites.length + constellation.satcat_missing_tle.length}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.active')}</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{constellation.satellites.filter((satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE).length}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.inactive')}</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{constellation.satcat_missing_tle.length}</Text>
                  </View>
                </View>
              </View>
              <SimpleButton icon={require('../../../assets/icons/FiRepeat.png')} text='Actualiser les positions' onPress={() => updateSatellitesPosition(constellation.satellites)} />
                <View style={starlinkTrackerStyles.content.glviewContainer}>
                  <GestureDetector gesture={gestures}>
                    <GLView style={starlinkTrackerStyles.content.glviewContainer.glview} onContextCreate={_onContextCreate} />
                  </GestureDetector>
                </View>
              <View style={starlinkTrackerStyles.content.launches}>
                <Text style={globalStyles.sections.title}>Prochains lancements</Text>
                <View style={starlinkTrackerStyles.content.launches.list}>
                  {
                    nextStarlinkLaunches.length > 0 ?
                    nextStarlinkLaunches.map((launch: any, launch_index: number) => (
                      <View key={launch_index} style={starlinkTrackerStyles.content.launches.list.launch}>
                        <Text style={starlinkTrackerStyles.content.launches.list.launch.title}>{launch.name.split('|')[1].trim()}</Text>
                        <View style={starlinkTrackerStyles.content.launches.list.launch.infos}>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Statut</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{getLaunchStatus(launch.status.id)}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Date</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{dayjs(launch.net).format('DD/MM/YYYY')}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Lanceur</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.rocket.configuration.name}</Text>
                          </View>
                        </View>
                        {
                          launchDetails === launch_index &&
                          <View style={starlinkTrackerStyles.content.launches.list.launch.moreInfos}>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Météo</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.weather_concerns ? "À surveiller" : "OK"}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Orbite visée</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.mission.orbit.abbrev}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>Type</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.launch_service_provider.type}</Text>
                            </View>
                          </View>
                        }
                        <View style={{marginTop: 10}}>
                          <SimpleButton small text='Voir plus de détails' onPress={() => handleLauncgDetails(launch_index)} />
                        </View>
                      </View>
                    ))
                    :
                    <SimpleButton disabled text='Pas de lancements prévus pour le moment.' />
                  }
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}