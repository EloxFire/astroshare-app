import React, { useState, useRef, useEffect } from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import { planetariumStyles } from '../../styles/screens/skymap/planetarium';
import {
  ComposedGesture, ExclusiveGesture,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureStateChangeEvent, GestureTouchEvent,
  GestureUpdateEvent,
  PanGesture,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
  PinchGesture,
  PinchGestureChangeEventPayload,
  PinchGestureHandlerEventPayload, SimultaneousGesture, TapGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext';
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { useStarCatalog } from '../../contexts/StarsContext';
import PlanetariumUI from "../../components/skymap/PlanetariumUI";
import { createPointerMaterial } from '../../helpers/scripts/astro/skymap/createPointerMaterial';
import {app_colors, planetTextures} from "../../helpers/constants";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {initScene} from "../../helpers/scripts/planetarium/initScene";
import {getGlobePosition} from "../../helpers/scripts/astro/skymap/getGlobePosition";
import {TapGesture} from "react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture";
import {
  applyInertia,
  handlePanChange,
  handlePanEnd,
  handlePanStart, inertiaEnabled
} from "../../helpers/scripts/planetarium/handlePanGesture";
import {
  handlePinchTouchDown,
  handlePinchTouchMove
} from "../../helpers/scripts/planetarium/handlePinchGesture";
import {handleTapStart} from "../../helpers/scripts/planetarium/handleTapGesture";
import {Star} from "../../helpers/types/Star";


let EquatorialGrid: any;
let AzimuthalGrid: any;
let Constellations: any;
let ground: any;
const pointerUICoos = [];
pointerUICoos.push(0, 1, 0);
const pointergeometry = new THREE.BufferGeometry();
pointergeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointerUICoos, 3));
const pointermaterial = createPointerMaterial();
const pointerUI = new THREE.Points(pointergeometry, pointermaterial);
pointerUI.visible = false;


export default function Planetarium({ route, navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const {planets, moonCoords} = useSolarSystem()

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const selectionCircleRef = useRef<THREE.Line | null>(null);

  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
  const [showEqGrid, setShowEqGrid] = useState<boolean>(false);
  const [showAzGrid, setShowAzGrid] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showGround, setShowGround] = useState<boolean>(true);
  const [glViewParams, setGlViewParams] = useState<any>({width: 0, height: 0});

  useEffect(() => {
    StatusBar.setHidden(true);

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const {scene, camera, renderer, ground, selectionCircle} = initScene(gl, currentUserLocation, starsCatalog.filter((star: Star) => star.V < 6), planets, moonCoords);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    groundRef.current = ground;
    selectionCircleRef.current = selectionCircle;

    setGlViewParams({width: gl.drawingBufferWidth, height: gl.drawingBufferHeight});
    setPlanetariumLoading(false);

    const animate = () => {
      requestAnimationFrame(animate);

      if (inertiaEnabled) {
        applyInertia(cameraRef, groundRef, gl.drawingBufferWidth);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    animate();


    /*

    pointerUI.frustumCulled = false;
    const pointerTextures = createPointerTextures();
    pointerUI.material.map = pointerTextures[0];
    pointerUI.renderOrder = 1;
    scene.add(pointerUI);
    let i = 1;

    ///// Grids and Constellations
    EquatorialGrid = createEquatorialGrid(0x337eff);
    EquatorialGrid.grid2.visible = false;
    EquatorialGrid.grid3.visible = false;

    AzimuthalGrid = createAzimuthalGrid(0x4b33ff);
    AzimuthalGrid.grid2.visible = false;
    AzimuthalGrid.grid3.visible = false;

    Object.keys(AzimuthalGrid).forEach((key) => {
      AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    });

    Constellations = drawConstellations();
    Constellations.renderOrder = 2;
    scene.add(Constellations);

    ground = createGround();
    ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    ground.renderOrder = 100;
    scene.add(ground);

    let q11 = new THREE.Quaternion;
    let q12 = new THREE.Quaternion;
    let q13 = new THREE.Quaternion;
    let Y1 = new THREE.Vector3(0, 0, 1);
    let X1 = new THREE.Vector3(1, 0, 0);
    q11.setFromAxisAngle(Y1, 0);
    q12.setFromAxisAngle(X1, Math.PI / 2);
    ground.getWorldQuaternion(q13);
    let qtot1 = q13.multiply(q11).multiply(q12);
    camera.setRotationFromQuaternion(qtot1.normalize());
    //camera.lookAt(convertSphericalToCartesian(10, 90, 90));

    setPlanetariumLoading(false);
    console.log('Planetarium loaded!');

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
      Object.keys(AzimuthalGrid).forEach((key) => {
        AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    // Start the animation
    animate();
     */
  };

  const panGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => handlePanStart(e))
    .onChange((e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
      handlePanChange(
        e,
        cameraRef,
        groundRef,
        glViewParams.width
      )
    })
    .onEnd((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => handlePanEnd(e))

  const pinchGesture = Gesture.Pinch()
    .onTouchesDown((e: GestureTouchEvent) => handlePinchTouchDown(e, cameraRef, glViewParams.width))
    .onTouchesMove((e: GestureTouchEvent) => handlePinchTouchMove(e, cameraRef, glViewParams.width))

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onStart((e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => handleTapStart(e, sceneRef, cameraRef, selectionCircleRef))


  const movementGestures: SimultaneousGesture = Gesture.Simultaneous(panGesture, pinchGesture);
  const actionGestures: ExclusiveGesture = Gesture.Exclusive(tapGesture);
  const composedGestures: ComposedGesture = Gesture.Race(movementGestures, actionGestures)



  const onShowEqGrid = () => {
    if (showEqGrid) {
      sceneRef.current?.remove(EquatorialGrid.grid1);
      sceneRef.current?.remove(EquatorialGrid.grid2);
      sceneRef.current?.remove(EquatorialGrid.grid3);
      setShowEqGrid(false);
    } else {
      sceneRef.current?.add(EquatorialGrid.grid1);
      sceneRef.current?.add(EquatorialGrid.grid2);
      sceneRef.current?.add(EquatorialGrid.grid3);
      setShowEqGrid(true);
    }
  }

  const onShowAzGrid = () => {
    if (showAzGrid) {
      sceneRef.current?.remove(AzimuthalGrid.grid1);
      sceneRef.current?.remove(AzimuthalGrid.grid2);
      sceneRef.current?.remove(AzimuthalGrid.grid3);
      setShowAzGrid(false);
    } else {
      sceneRef.current?.add(AzimuthalGrid.grid1);
      sceneRef.current?.add(AzimuthalGrid.grid2);
      sceneRef.current?.add(AzimuthalGrid.grid3);
      setShowAzGrid(true);
    }
  }
  const onShowConstellations = () => {
    if (showConstellations) {
      sceneRef.current?.remove(Constellations);
      setShowConstellations(false);
    } else {
      sceneRef.current?.add(Constellations);
      setShowConstellations(true);
    }
  }

  const onShowGround = () => {
    if (showGround) {
      sceneRef.current?.remove(ground);
      setShowGround(false);
    } else {
      sceneRef.current?.add(ground);
      setShowGround(true);
    }
  }


/*
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

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart((e) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (camera && scene) {
        const raycaster = new THREE.Raycaster();
        raycaster.near = 9;
        raycaster.params.Points.threshold = 0.0015 * camera.getEffectiveFOV();
        raycaster.far = 11;
        const pointer = new THREE.Vector2();
        // console.log('Single tap!');
        pointer.x = (e.x / window.innerWidth) * 2 - 1;
        pointer.y = - (e.y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects: Intersection[] = raycaster.intersectObjects(scene.children);
        console.log("Intersects: ", intersects[0].object);
        let Vmin = 30.0;
        let index = '0';
        if (typeof intersects[0] !== 'undefined') {
          intersects.forEach((value, i) => {
            if (Vmin > parseFloat(starsCatalog[intersects[i].index!.toString()].V)) {
              index = intersects[i].index!.toString();
              Vmin = parseFloat(starsCatalog[intersects[i].index!.toString()].V);
            }
          })
          let pointerCoos = convertSphericalToCartesian(0.5, parseFloat(starsCatalog[index].ra), parseFloat(starsCatalog[index].dec));
          let g = pointerUI.geometry;
          let p = g.getAttribute('position');
          p.setXYZ(0, pointerCoos.x, pointerCoos.y, pointerCoos.z);
          p.needsUpdate = true;
          pointerUI.visible = true;
          setCurrentTapInfos(starsCatalog[index]);
          camera.updateProjectionMatrix();
        } else {
          setCurrentTapInfos(null);
          pointerUI.visible = false;
        }
      }
    });
  */

  return (
    <GestureHandlerRootView>
      <PlanetariumUI
        navigation={navigation}
        infos={null}
        onShowAzGrid={onShowAzGrid}
        onShowConstellations={onShowConstellations}
        onShowEqGrid={onShowEqGrid}
        onShowGround={onShowGround}
        onShowPlanets={() => { }}
        onShowDSO={() => { }}
        onCenterObject={() => { }}
      />
      <GestureDetector gesture={composedGestures}>
        <View style={planetariumStyles.container}>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
          {planetariumLoading && (
            <View style={planetariumStyles.loadingScreen}>
              <ActivityIndicator size="large" color={app_colors.white} />
              <Text style={{ color: app_colors.white }}>Loading...</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}