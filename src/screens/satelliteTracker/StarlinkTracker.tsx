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

export default function StarlinkTracker({ navigation }: any) {

  const {constellation} = useSpacex()

  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 50000);
    const renderer = new ExpoTHREE.Renderer({ gl });
    
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    renderer.setClearColor(0x080808);
    
    camera.position.set(0, 0, 5);
    
    // Store them in refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // const axesHelper = new THREE.AxesHelper(3);
    // sceneRef.current.add(axesHelper);

    // Create a sphere to represent the Earth
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128);
    const textureLoader = new ExpoTHREE.TextureLoader();
    const earthTexture = await textureLoader.loadAsync(require('../../../assets/images/textures/nasa_globe_flat.jpg'));
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    sceneRef.current.add(earth);

    // Store the earth mesh in a ref
    earthMeshRef.current = earth;

    // Add satellites to the scene
    const geometry = new THREE.SphereGeometry(0.03, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: app_colors.red });

    // Create an InstancedMesh
    const count = constellation.satellites.length;
    const instanceMesh = new THREE.InstancedMesh(geometry, material, count);

    // Populate the instances
    const positionAttribute = geometry.attributes.position;
    const matrix = new THREE.Matrix4();

    const satellites = constellation.satellites;
    satellites.splice(0, 2).forEach((satellite: StarlinkSatellite, index: number) => {
      if(satellite.TLE){
        getSatelliteCoordsFromTLE(satellite.TLE).then(position => {
          if(!position) return;
          const radius = 1 + position.altitude / 100;  // Radius from the Earth's surface
          const x = radius * Math.cos(position.latitude) * Math.cos(position.longitude);
          const y = radius * Math.sin(position.latitude);
          const z = radius * Math.cos(position.latitude) * Math.sin(position.longitude);

          matrix.setPosition(x, y, z);
          instanceMesh.setMatrixAt(index, matrix);
        });
      }
    });

    if(sceneRef.current) sceneRef.current.add(instanceMesh);


    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      // ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    // Start the animation
    animate();
  };

  let oldX = 0.0, oldY = 0.0;
  let polarAngle = Math.PI / 2;  // Angle vertical (hauteur)
  let azimuthalAngle = 0;  // Angle horizontal (autour de l'axe Y)
  const rotationSpeed = 0.005;  
  const distanceFromEarth = 5;  // Distance fixe de la caméra par rapport à la Terre
  
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
      oldX = 0;
      oldY = 0;
    })
    .onChange((e) => {
      const camera = cameraRef.current;
  
      if (camera) {
        const deltaX = e.translationX - oldX;
        const deltaY = e.translationY - oldY;
  
        azimuthalAngle += deltaX * rotationSpeed;  // Rotation horizontale libre
        polarAngle -= deltaY * rotationSpeed;  // Rotation verticale libre
  
        // Contrainte sur l'angle polaire pour éviter de passer sous ou au-dessus de la Terre
        polarAngle = Math.max(0.1, Math.min(Math.PI - 0.1, polarAngle));
  
        updateCameraPosition(camera);
  
        oldX = e.translationX;
        oldY = e.translationY;
      }
    });


  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.starlinkTracker.title')}
          subtitle={i18n.t('satelliteTracker.starlinkTracker.subtitle')}
        />
        <View style={globalStyles.screens.separator} />
        <View style={starlinkTrackerStyles.stats}>
          <View style={starlinkTrackerStyles.stats.stat}>
            <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.total')}</Text>
            <Text style={starlinkTrackerStyles.stats.stat.value}>{constellation.satellites.length + constellation.satcat_missing_tle.length}</Text>
          </View>
          <View style={starlinkTrackerStyles.stats.stat}>
            <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.active')}</Text>
            <Text style={starlinkTrackerStyles.stats.stat.value}>{constellation.satellites.filter((satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE).length}</Text>
          </View>
          <View style={starlinkTrackerStyles.stats.stat}>
            <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.inactive')}</Text>
            <Text style={starlinkTrackerStyles.stats.stat.value}>{constellation.satcat_missing_tle.length}</Text>
          </View>
        </View>
        <ScrollView style={{marginTop: 50}}>
          <GestureDetector gesture={pan}>
            <GLView style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').width }} onContextCreate={_onContextCreate} />
          </GestureDetector>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}