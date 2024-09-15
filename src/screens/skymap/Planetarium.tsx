import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { planetariumStyles } from '../../styles/screens/skymap/planetarium'
import { Image } from 'expo-image'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext'
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { Star } from '../../helpers/types/Star'
import axios from 'axios'
import { convertEquatorialToHorizontal } from '@observerly/astrometry'
import { createStarMaterial } from '../../helpers/scripts/astro/skymap/createStarMaterial'

export default function Planetarium({ navigation }: any) {

  const { currentUserLocation } = useSettings()

  const [starCatalog, setStarCatalog] = useState<Star[]>([])

  // THREE related objects
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null)

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
    const brightStars = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars`);
    setStarCatalog(brightStars.data.data)
    
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    // INIT THREE OBJECTS
    const _scene = new THREE.Scene()
    const _camera = new THREE.PerspectiveCamera(120, drawingBufferWidth / drawingBufferHeight, 0.1, 50000)
    const _renderer = new ExpoTHREE.Renderer({ gl })
    
    _renderer.setSize(drawingBufferWidth, drawingBufferHeight)
    _renderer.setClearColor(0x080808)
    _camera.position.set(0, 0, 0) // Very important, everything is calculated from this point

    // Axis helper
    // const axesHelper = new THREE.AxesHelper( 3 );
    // _scene.add( axesHelper );

    // Add stars to the scene
    brightStars.data.data.forEach((star: Star) => {
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

      _scene.add(starPoint);
    })

    const animate = () => {
      requestAnimationFrame(animate);
      _renderer.render(_scene, _camera);
      gl.endFrameEXP();
    };
    
    setCamera(_camera)
    setScene(_scene)
    setRenderer(_renderer)
    animate();
  }

  return (
    <View style={planetariumStyles.container}>
      <TouchableOpacity style={planetariumStyles.container.backButton} onPress={() => navigation.goBack()}>
        <Image style={planetariumStyles.container.backButton.icon} source={require('../../../assets/icons/FiChevronDown.png')} />
        <Text style={planetariumStyles.container.backButton.text}>Retour stars: {starCatalog.length}</Text>
      </TouchableOpacity>
      <GestureHandlerRootView>
        <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
      </GestureHandlerRootView>
    </View>
  )
}
