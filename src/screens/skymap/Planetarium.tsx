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
import { getStarColor, getStarMaterial } from '../../helpers/scripts/astro/skymap/createStarMaterial';
import { useStarCatalog } from '../../contexts/StarsContext';
import { getEffectiveAngularResolution } from '../../helpers/scripts/astro/skymap/getEffectiveAngularResolution';
import { getEuclideanDistance } from '../../helpers/scripts/astro/skymap/getEuclideanDistance';
import { getFovFromAngularResolution } from '../../helpers/scripts/astro/skymap/getFovFromAngularResolution';
import { createEquatorialGrid } from '../../helpers/scripts/astro/skymap/createEquatorialGrid';
import { drawConstellations } from '../../helpers/scripts/astro/skymap/drawConstellations';
import { createGround } from '../../helpers/scripts/astro/skymap/createGround';
import { convertSphericalToCartesian } from '../../helpers/scripts/astro/skymap/convertSphericalToCartesian';
import { getGlobePosition } from '../../helpers/scripts/astro/skymap/getGlobePosition';
import PlanetariumUI from "../../components/skymap/PlanetariumUI";
import { createAzimuthalGrid } from '../../helpers/scripts/astro/skymap/createAzimuthalGrid';
import { createPointerMaterial } from '../../helpers/scripts/astro/skymap/createPointerMaterial';
import { createPointerTextures } from '../../helpers/scripts/astro/skymap/createPointerTextures';

let IsInertia = false;
let oldX = 0.0, oldY = 0.0;
let Vx = 0.0, Vy = 0.0;
let camWdth = 0;
let EquatorialGrid: any;
let AzimuthalGrid: any;
const pointerUICoos = [];
pointerUICoos.push(0, 1, 0);
const pointergeometry = new THREE.BufferGeometry();
pointergeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointerUICoos, 3));
const pointermaterial = createPointerMaterial();
const pointerUI = new THREE.Points(pointergeometry, pointermaterial);
pointerUI.visible = false;


export default function Planetarium({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { lat, lon } = currentUserLocation;
  const { starsCatalog } = useStarCatalog();

  const [cameraWidth, setCameraWidth] = useState<number>(0);
  const [cameraHeight, setCameraHeight] = useState<number>(0);

  // Use refs for THREE-related objects to keep their state across renders
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);

  const [currentTapInfos, setCurrentTapInfos] = useState<any>(null);
  const [currentTapType, setCurrentTapType] = useState<'constellation' | 'star' | 'planet' | 'dso' | null>('star');

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    setCameraWidth(drawingBufferWidth);
    setCameraHeight(drawingBufferHeight);
    camWdth = drawingBufferWidth;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, drawingBufferWidth / drawingBufferHeight, 0.1, 10000);
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    renderer.setClearColor(0x080808); // Background color

    camera.position.set(0, 0, 0); // Camera positioned at the origin

    // Store them in refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const stars: number[] = [];
    const starSize: number[] = [];
    const starColor: number[] = [];
    const geometry = new THREE.BufferGeometry();
    const material = getStarMaterial();
    starsCatalog.forEach((star: Star) => {
      const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);
      stars.push(x, y, z);
      starSize.push(300 * Math.exp(-star.V / 3));
      const indice = getStarColor(star.sp_type);
      starColor.push(indice, 0.5, 1.0 - indice, 1.0);
    })
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(starSize, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(starColor, 4));
    const starsCloud = new THREE.Points(geometry, material);
    starsCloud.frustumCulled = false;
    scene.add(starsCloud);

    pointerUI.frustumCulled = false;
    const pointerTextures = createPointerTextures();
    pointerUI.material.map = pointerTextures[0];
    scene.add(pointerUI);
    let i = 1;

    /////
    EquatorialGrid = createEquatorialGrid(0x0000ff);
    EquatorialGrid.grid2.visible = false;
    EquatorialGrid.grid3.visible = false;
    // scene.add(EquatorialGrid.grid1);
    // scene.add(EquatorialGrid.grid2);
    // scene.add(EquatorialGrid.grid3);
    AzimuthalGrid = createAzimuthalGrid(0x00ff00);
    AzimuthalGrid.grid2.visible = false;
    AzimuthalGrid.grid3.visible = false;
    Object.keys(AzimuthalGrid).forEach(key => {
      AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    });

    // scene.add(AzimuthalGrid.grid1);
    // scene.add(AzimuthalGrid.grid2);
    // scene.add(AzimuthalGrid.grid3);

    let Constellations = drawConstellations();
    scene.add(Constellations);
    ////

    // camera.rotateX(90) // Pour que le sol soit perpendiculaire à la camera (mais ca donne une soucis sur la rotation de la camera, a voir)
    let ground = createGround();
    ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    scene.add(ground);

    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      if (IsInertia) {
        Inertia();
      }

      if (i == 45) {
        pointerUI.material.map = pointerTextures[i];
        i = 0;
      } else {
        pointerUI.material.map = pointerTextures[i];
        i = i + 1;
      }

      ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      Object.keys(AzimuthalGrid).forEach(key => {
        AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      });
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    // Start the animation
    animate();
  };



  const pan = Gesture.Pan()
    .onBegin(() => {
      IsInertia = false;
    })
    .onStart(() => {
      // console.log('onStart');
      oldX = 0;
      oldY = 0;
      Vx = 0;
      Vy = 0;
    })
    .onChange((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (camera) {
        camera.rotateY(getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationX - oldX));
        camera.rotateX(getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationY - oldY));
        oldX = e.translationX;
        oldY = e.translationY;
        Vx = e.velocityX;
        Vy = e.velocityY;
        camera.updateProjectionMatrix();
      } else {
        console.log("camera is undefined");
      }
    })
    .onEnd(() => {
      IsInertia = true;
    });

  const Inertia = () => {
    const camera = cameraRef.current;
    if (camera) {
      camera.rotateY(getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vx * 0.01);
      camera.rotateX(getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vy * 0.01);
      Vx = Vx * 0.98;
      Vy = Vy * 0.98;
      if (Math.abs(Vx) < 0.1) {
        Vx = 0;
      }
      if (Math.abs(Vy) < 0.1) {
        Vy = 0;
      }
      if (Vy == 0 && Vx == 0) {
        IsInertia = false;
      }
      return camera.updateProjectionMatrix();
    }
  }

  let startAngle: number;
  const pinch = Gesture.Pinch()
    .onTouchesDown((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (!camera) return;
      if (e.numberOfTouches == 2) {
        let startDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y); //distance initiale en pixel entre les deux doigts
        startAngle = startDistance * getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth); //angle entre les deux point celeste pointé par les doigts
      }
    })
    .onTouchesMove((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (!camera) return;
      if (e.numberOfTouches == 2) {
        let currentDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y);
        let newAngularResolution = startAngle / currentDistance;
        let newFOV = getFovFromAngularResolution(newAngularResolution, cameraWidth);
        if (newFOV < 0.01) {
          newFOV = 0.01;
        } else if (newFOV > 120) {
          newFOV = 120;
        }
        if (newFOV > 50) {
          EquatorialGrid.grid1.visible = true;
          EquatorialGrid.grid2.visible = false;
          EquatorialGrid.grid3.visible = false;

          AzimuthalGrid.grid1.visible = true;
          AzimuthalGrid.grid2.visible = false;
          AzimuthalGrid.grid3.visible = false;
        }
        if (newFOV <= 50 && newFOV > 10) {
          EquatorialGrid.grid1.visible = false;
          EquatorialGrid.grid2.visible = true;
          EquatorialGrid.grid3.visible = false;

          AzimuthalGrid.grid1.visible = false;
          AzimuthalGrid.grid2.visible = true;
          AzimuthalGrid.grid3.visible = false;
        }
        if (newFOV <= 10) {
          EquatorialGrid.grid1.visible = false;
          EquatorialGrid.grid2.visible = false;
          EquatorialGrid.grid3.visible = true;

          AzimuthalGrid.grid1.visible = false;
          AzimuthalGrid.grid2.visible = false;
          AzimuthalGrid.grid3.visible = true;
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

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart((e) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (camera && scene) {
        const raycaster = new THREE.Raycaster();
        raycaster.near = 1.1;
        raycaster.params.Points.threshold = 0.02 * Math.sqrt(camera.getEffectiveFOV() ^ (2) + 5);
        raycaster.far = 100;
        const pointer = new THREE.Vector2();
        // console.log('Single tap!');
        pointer.x = (e.x / window.innerWidth) * 2 - 1;
        pointer.y = - (e.y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (typeof intersects[0] !== 'undefined') {
          let pointerCoos = convertSphericalToCartesian(0.5, parseFloat(starsCatalog[intersects[0].index!.toString()].ra), parseFloat(starsCatalog[intersects[0].index!.toString()].dec));
          let g = pointerUI.geometry;
          let p = g.getAttribute('position');
          p.setXYZ(0, pointerCoos.x, pointerCoos.y, pointerCoos.z);
          p.needsUpdate = true;
          pointerUI.visible = true;
          // setCurrentTapInfos(starsCatalog[intersects[0].index!.toString()]);
          camera.updateProjectionMatrix();
        } else {
          // setCurrentTapInfos(null);
          pointerUI.visible = false;
        }
      }
    });

  const gestures = Gesture.Simultaneous(pinch, rotation, pan);
  const taps = Gesture.Exclusive(singleTap);
  const composed = Gesture.Race(gestures, taps);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composed}>
        <View style={planetariumStyles.container}>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
          <PlanetariumUI navigation={navigation} infos={currentTapInfos} infoType={currentTapType} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}