import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { planetariumStyles } from '../../styles/screens/skymap/planetarium';
import { Image } from 'expo-image';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext';
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { Star } from '../../helpers/types/Star';
import { convertEquatorialToHorizontal } from '@observerly/astrometry';
import { getStarMaterial } from '../../helpers/scripts/astro/skymap/createStarMaterial';
import { useStarCatalog } from '../../contexts/StarsContext';
import { getEffectiveAngularResolution } from '../../helpers/scripts/astro/skymap/getEffectiveAngularResolution';
import { convertAltAzToXYZ } from '../../helpers/scripts/astro/coords/convertAltAzToXYZ';
import { getEuclideanDistance } from '../../helpers/scripts/astro/skymap/getEuclideanDistance';
import { getFovFromAngularResolution } from '../../helpers/scripts/astro/skymap/getFovFromAngularResolution';
import { getGlobePosition } from './getGlobePosition';

export default function Planetarium({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();

  const [cameraWidth, setCameraWidth] = useState<number>(0);
  const [cameraHeight, setCameraHeight] = useState<number>(0);

  // Use refs for THREE-related objects to keep their state across renders
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);

  // Add THREE axis helper to the scene
  
  
  
  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    setCameraWidth(drawingBufferWidth);
    setCameraHeight(drawingBufferHeight);
    
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, drawingBufferWidth / drawingBufferHeight, 0.1, 50000);
    const renderer = new ExpoTHREE.Renderer({ gl });
    
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    renderer.setClearColor(0x080808); // Background color
    
    camera.position.set(0, 0, 0); // Camera positioned at the origin
    const axesHelper = new THREE.AxesHelper(5);
    
    // Store them in refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Group stars by their material type for efficient rendering
    const materialGroups: { [key: string]: { positions: Float32Array, geometry: THREE.BufferGeometry } } = {};
    sceneRef.current.add(axesHelper);
    
    // Iterate over the stars and group them by material type
    starsCatalog.forEach((star: Star, index: number) => {
      const { alt, az } = convertEquatorialToHorizontal(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: star.ra, dec: star.dec });
      const { x, y, z } = convertAltAzToXYZ(alt, az, 5);

      // Get the material for the star
      const starType = star.sp_type ? star.sp_type[0] : 'A';

      // Check if this material group exists, if not, create it
      if (!materialGroups[starType]) {
        const positions = new Float32Array(starsCatalog.length * 3); // 3 values per star (x, y, z)
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        materialGroups[starType] = { positions, geometry };
      }

      // Add this star's position to the appropriate material group
      const { positions } = materialGroups[starType];
      const i3 = index * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    });

    // Now create Points objects for each material group and add them to the scene
    Object.keys(materialGroups).forEach((starType) => {
      const { positions, geometry } = materialGroups[starType];

      // Update geometry with positions
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Create Points object and add it to the scene
      const starMaterial = getStarMaterial({ sp_type: starType } as Star); // Get material by type
      const stars = new THREE.Points(geometry, starMaterial);
      scene.add(stars);
    });

    const Groundgeometry = new THREE.SphereGeometry(1, 64, 64, Math.PI, Math.PI, 0, Math.PI);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    material.side = THREE.BackSide;
    let ground = new THREE.Mesh(Groundgeometry, material);
    let vec = getGlobePosition(currentUserLocation.lat, currentUserLocation.lon);

    camera.rotateX(90)
    scene.add(ground);

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
  const pan = Gesture.Pan()
  .onStart(() => {
    console.log('onStart');
    oldX = 0;
    oldY = 0;
  })
  .onChange((e) => {
    const camera = cameraRef.current; // Access camera from ref
    if (camera) {
      camera.rotateY(getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationX - oldX));
      camera.rotateX(getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationY - oldY));
      oldX = e.translationX;
      oldY = e.translationY;
      camera.updateProjectionMatrix();
    } else {
      console.log("camera is undefined");
    }
  });

  let startAngle: number;
  const pinch = Gesture.Pinch()
  .onTouchesDown((e) => {
    const camera = cameraRef.current; // Access camera from ref
    if(!camera) return;
    if (e.numberOfTouches == 2) {
      let startDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y); //distance initiale en pixel entre les deux doigts
      startAngle = startDistance * getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth); //angle entre les deux point celeste pointé par les doigts
    }
  })
  .onTouchesMove((e) => {
    const camera = cameraRef.current; // Access camera from ref
    if(!camera) return;
    if (e.numberOfTouches == 2) {
      let currentDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y);
      let newAngularResolution = startAngle / currentDistance;
      let newFOV = getFovFromAngularResolution(newAngularResolution, cameraWidth);
      if (newFOV < 0.01) {
        newFOV = 0.01;
      } else if (newFOV > 120) {
        newFOV = 120;
      }
      camera.fov = newFOV;
      camera.updateProjectionMatrix();
    }
  });

  let actualRotation: number;
  const rotation = Gesture.Rotation()
    .onStart((e) => {
      actualRotation = 0;
    })
    .onChange((e) => {
      const camera = cameraRef.current;
      if (!camera) return;
      camera.rotateZ(e.rotation - (actualRotation || 0));
      actualRotation = e.rotation;
      camera.updateProjectionMatrix();
    })
    .simultaneousWithExternalGesture(pinch);

  const gestures = Gesture.Simultaneous(pinch, pan);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gestures}>
        <View style={planetariumStyles.container}>
          <TouchableOpacity style={planetariumStyles.container.backButton} onPress={() => navigation.goBack()}>
            <Image style={planetariumStyles.container.backButton.icon} source={require('../../../assets/icons/FiChevronDown.png')} />
            <Text style={planetariumStyles.container.backButton.text}>
              Retour stars: {starsCatalog.length} | Camera width: {cameraWidth}
            </Text>
          </TouchableOpacity>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}