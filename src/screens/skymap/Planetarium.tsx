import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { planetariumStyles } from '../../styles/screens/skymap/planetarium'
import { Image } from 'expo-image'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext'
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { Star } from '../../helpers/types/Star'
import { convertEquatorialToHorizontal } from '@observerly/astrometry'
import { createStarMaterial } from '../../helpers/scripts/astro/skymap/createStarMaterial'
import { useStarCatalog } from '../../contexts/StarsContext'
import { app_colors } from '../../helpers/constants'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'

export default function Planetarium({ navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { starsCatalog } = useStarCatalog()

  const [starsCatalogLoading, setStarsCatalogLoading] = useState<boolean>(true)
  const [cameraWidth, setCameraWidth] = useState<number>(0)
  const [cameraHeight, setCameraHeight] = useState<number>(0)

  // THREE related objects
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let renderer: ExpoTHREE.Renderer;

  const degToRad = (deg: number) => deg * (Math.PI / 180);

  const convertAltAzToXYZ = (alt: number, az: number, radius: number) => {
    const altRad = degToRad(alt);
    const azRad = degToRad(az);
  
    const x = radius * Math.cos(altRad) * Math.sin(azRad);
    const y = radius * Math.sin(altRad);
    const z = radius * Math.cos(altRad) * Math.cos(azRad);
  
    return { x, y, z };
  };

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    console.log('onContextCreate');    
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    setCameraWidth(drawingBufferWidth)
    setCameraHeight(drawingBufferHeight)

    // INIT THREE OBJECTS
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(120, drawingBufferWidth / drawingBufferHeight, 0.1, 50000)
    renderer = new ExpoTHREE.Renderer({ gl })
    
    renderer.setSize(drawingBufferWidth, drawingBufferHeight)
    renderer.setClearColor(0x080808)
    camera.position.set(0, 0, 0) // Very important, everything is calculated from this point

    // Axis helper
    // const axesHelper = new THREE.AxesHelper( 3 );
    // _scene.add( axesHelper );

    // Add stars to the scene
    starsCatalog.forEach((star: Star) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(1 * 3);
      const colors = new Float32Array(1 * 3);

      const positionAttribute = new THREE.BufferAttribute(positions, 3);
      const colorAttribute = new THREE.BufferAttribute(colors, 3);

      geometry.setAttribute('position', positionAttribute);
      geometry.setAttribute('color', colorAttribute);

      const starPoint = new THREE.Points(geometry, createStarMaterial(star));

      const { alt, az } = convertEquatorialToHorizontal(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: star.ra, dec: star.dec });
      const { x, y, z } = convertAltAzToXYZ(alt, az, 5);

      positionAttribute.setXYZ(0, x, y, z);
      colorAttribute.setXYZ(0, 1, 1, 1);

      scene.add(starPoint);
    })

    console.log('Stars added to the scene');
    
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    
    setStarsCatalogLoading(false)
    animate();
  }

  let oldX = 0.0, oldY = 0.0;
  let Vx = 0.0, Vy = 0.0;
  const pan = Gesture.Pan()
    .onStart(() => {
      console.log('onStart');
      
      oldX = 0;
      oldY = 0;
      Vx = 0;
      Vy = 0;
    })
    .onChange((e) => {
      if (typeof camera !== 'undefined') {
        camera.rotateY(EffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationX - oldX))
        oldX = e.translationX;
        // console.log("a");
        camera.rotateX(EffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationY - oldY))
        oldY = e.translationY;
        Vx = e.velocityX;
        Vy = e.velocityY;
        camera.updateProjectionMatrix();
      }
    })

  function EffectiveAngularResolution(FOV: Float, NumPix: number) {
    return ((FOV / NumPix) * Math.PI) / 180; //résolution angulaire d'un pixel (de l'écran) en radian, à utiliser pour le gesture handler (orientation de la caméra corrélé au nombre de pixel déplacé au doigt)
  }

//  useEffect(() => {
//   const interval = setInterval(() => {
//     if(camera) camera.rotateY(0.01);
//   }, 1000);

//   return () => clearInterval(interval);
//  }, [])

  return (
    <GestureHandlerRootView>
        <GestureDetector gesture={pan}>
      <View style={planetariumStyles.container}>
        <TouchableOpacity style={planetariumStyles.container.backButton} onPress={() => navigation.goBack()}>
          <Image style={planetariumStyles.container.backButton.icon} source={require('../../../assets/icons/FiChevronDown.png')} />
          <Text style={planetariumStyles.container.backButton.text}>Retour stars: {starsCatalog.length}</Text>
        </TouchableOpacity>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
      </View>
        </GestureDetector>
    </GestureHandlerRootView>
  )
}
