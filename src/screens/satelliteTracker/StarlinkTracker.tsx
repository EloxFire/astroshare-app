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

  const earthRadius = 6371;  // Earth radius in km


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000); // Ajout d'un far grand
    const renderer = new ExpoTHREE.Renderer({ gl });
  
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
  
    // Ajuste la caméra pour qu'elle soit un peu plus éloignée afin de voir la Terre et les satellites
    camera.position.set(0, 0, 15000);
  
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
  
    // Satellite geometry (agrandi pour être visible)
    const satelliteGeometry = new THREE.SphereGeometry(15, 32, 32);  // Taille temporaire plus grande
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: app_colors.red });
  
    // Utilisation d'InstancedMesh pour afficher plusieurs satellites
    const instanceCount = constellation.satellites.length; // Nombre de satellites affichés
    const instanceMesh = new THREE.InstancedMesh(satelliteGeometry, satelliteMaterial, instanceCount);
  
    const matrix = new THREE.Matrix4();
  
    // Charger et positionner les satellites
    const satellites = constellation.satellites.slice(0, instanceCount);
  
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
  
    sceneRef.current.add(instanceMesh);
  
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
  let distanceFromEarth = 15000;  // Distance fixe de la caméra par rapport à la Terre
  
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

    // Ajout du zoom
  const zoom = Gesture.Pinch()
    .onChange((e) => {
      const camera = cameraRef.current;
  
      if (camera) {
        distanceFromEarth *= 1 - e.scale;
  
        // Contrainte sur la distance pour éviter de rentrer dans la Terre
        distanceFromEarth = Math.max(1, Math.min(10, distanceFromEarth));
  
        updateCameraPosition(camera);
      }
    });

    const gestures = Gesture.Simultaneous(pan, zoom);


  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.starlinkTracker.title')}
          subtitle={i18n.t('satelliteTracker.starlinkTracker.subtitle')}
        />
        <View style={globalStyles.screens.separator} />
        <View style={starlinkTrackerStyles.statsContainer}>
          <Text style={globalStyles.sections.title}>Constellation</Text>
          <View style={starlinkTrackerStyles.statsContainer.stats}>
            <View style={starlinkTrackerStyles.statsContainer.stats.stat}>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.total')}</Text>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.value}>{constellation.satellites.length + constellation.satcat_missing_tle.length}</Text>
            </View>
            <View style={starlinkTrackerStyles.statsContainer.stats.stat}>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.active')}</Text>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.value}>{constellation.satellites.filter((satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE).length}</Text>
            </View>
            <View style={starlinkTrackerStyles.statsContainer.stats.stat}>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.inactive')}</Text>
              <Text style={starlinkTrackerStyles.statsContainer.stats.stat.value}>{constellation.satcat_missing_tle.length}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{marginTop: 20}}>
          <View style={starlinkTrackerStyles.glviewContainer}>
            <GestureDetector gesture={gestures}>
              <GLView style={starlinkTrackerStyles.glviewContainer.glview} onContextCreate={_onContextCreate} />
            </GestureDetector>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}