import React, {useRef, useState} from 'react';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView, GestureStateChangeEvent, GestureTouchEvent, GestureUpdateEvent,
  PanGesture, PanGestureHandlerEventPayload,
  PinchGesture,
  RotationGesture, TapGesture, TapGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import {useSettings} from "../../contexts/AppSettingsContext";
import {useStarCatalog} from "../../contexts/StarsContext";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import {ActivityIndicator, Text, View} from "react-native";
import {planetariumStyles} from "../../styles/screens/skymap/planetarium";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import {app_colors} from "../../helpers/constants";
import {initPlanetariumScene} from "../../helpers/scripts/astro/skymap/planetarium/initPlanetariumScene";
import {initMilkyWayBackground} from "../../helpers/scripts/astro/skymap/planetarium/initMilkyWayBackground";
import {animateScene} from "../../helpers/scripts/astro/skymap/planetarium/animateScene";
import {initStars} from "../../helpers/scripts/astro/skymap/planetarium/initStars";
import {initDso} from "../../helpers/scripts/astro/skymap/planetarium/initDso";
import {initPlanets} from "../../helpers/scripts/astro/skymap/planetarium/initPlanets";
import {initMoon} from "../../helpers/scripts/astro/skymap/planetarium/initMoon";
import {initGround} from "../../helpers/scripts/astro/skymap/planetarium/initGround";
import {placeCamera} from "../../helpers/scripts/astro/skymap/planetarium/placeCamera";
import {initConstellations} from "../../helpers/scripts/astro/skymap/planetarium/initConstellations";
import {handleBeginPan} from "../../helpers/scripts/astro/skymap/planetarium/gestures/pan/handleBeginPan";
import {handleChangePan} from "../../helpers/scripts/astro/skymap/planetarium/gestures/pan/handleChangePan";
import {handleTouchesDownPinch} from "../../helpers/scripts/astro/skymap/planetarium/gestures/pinch/handleTouchesDownPinch";
import {handleToucheMovePinch} from "../../helpers/scripts/astro/skymap/planetarium/gestures/pinch/handleToucheMovePinch";
import {handleStartTap} from "../../helpers/scripts/astro/skymap/planetarium/gestures/tap/handleStartTap";
import {initPointer} from "../../helpers/scripts/astro/skymap/planetarium/initPointer";


export default function Planetarium({ route, navigation }: any) {

  // DATA FROM CONTEXTS (STARS, PLANETS, MOON, USER LOCATION)
  const { planets, moonCoords } = useSolarSystem()
  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();

  // GLOBAL STATES RELATED TO THE PLANETARIUM
  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
  const [cameraWidth, setCameraWidth] = useState<number>(0);
  const [cameraHeight, setCameraHeight] = useState<number>(0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const milkyWayMeshRef = useRef<THREE.Mesh | null>(null);
  const starsMeshRef = useRef<THREE.Points | null>(null);
  const dsoMeshRef = useRef<THREE.Mesh[] | null>(null);
  const planetsMeshRef = useRef<THREE.Group | null>(null);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const constellationsMeshRef = useRef<THREE.Group | null>(null);
  const pointerMeshRef = useRef<THREE.Points | null>(null);

  const panGestureRef = useRef<PanGesture | null>(null);
  const pinchGestureRef = useRef<PinchGesture | null>(null);
  const tapGestureRef = useRef<TapGesture | null>(null);


  // PLANETARIUM UI CUSTOMIZATION
  const [showEqGrid, setShowEqGrid] = useState<boolean>(false);
  const [showAzGrid, setShowAzGrid] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showGround, setShowGround] = useState<boolean>(true);


  // GESTURES RELATED VARIABLES
  const cameraInertiaActiveRef = useRef<boolean>(false);
  let oldCameraX: number = 0.0, oldCameraY: number = 0.0;
  let vX: number = 0.0, vY: number = 0.0;
  let azAngle: number = 0.0, altAngle: number = Math.PI / 2;
  let startPinchAngle: number;


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const cameraWidth: number = gl.drawingBufferWidth;
    const cameraHeight: number = gl.drawingBufferHeight;
    setCameraWidth(cameraWidth);
    setCameraHeight(cameraHeight);

    const {scene, camera, renderer} = initPlanetariumScene(gl, cameraWidth, cameraHeight) // INITIALIZING SCENE
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    if(!sceneRef.current || !cameraRef.current || !rendererRef.current) {
      console.error('[Planetarium] Error initializing scene, camera or renderer.')
      return
    }

    milkyWayMeshRef.current = initMilkyWayBackground(sceneRef.current); // ADD MILKY WAY BACKGROUND
    starsMeshRef.current = initStars(sceneRef.current, starsCatalog); // ADD STARS
    dsoMeshRef.current = initDso(sceneRef.current); // ADD DEEP SKY OBJECTS
    planetsMeshRef.current = initPlanets(sceneRef.current, planets); // ADD PLANETS
    moonMeshRef.current = initMoon(sceneRef.current, moonCoords); // ADD MOON
    groundMeshRef.current = initGround(sceneRef.current, currentUserLocation.lat, currentUserLocation.lon); // ADD GROUND
    constellationsMeshRef.current = initConstellations(sceneRef.current); // ADD CONSTELLATIONS
    pointerMeshRef.current = initPointer(); // ADD POINTER

    // Rotate camera locked on the Alt/Az axes
    placeCamera(cameraRef.current, groundMeshRef.current); // PLACE CAMERA

    // ANIMATING SCENE
    animateScene(gl, sceneRef.current, cameraRef.current, groundMeshRef.current, cameraWidth, azAngle, altAngle, vX, vY, rendererRef.current, cameraInertiaActiveRef.current);
    setTimeout(() => setPlanetariumLoading(false), 2000);
  }

  // GESTURE HANDLERS
  panGestureRef.current = Gesture.Pan().onBegin(() => {
    cameraInertiaActiveRef.current = handleBeginPan(cameraInertiaActiveRef.current); // Set inertia movement to false
  }).onStart(() => {
    oldCameraX = 0.0;
    oldCameraY = 0.0;
    vX = 0.0;
    vY = 0.0;
  }).onChange((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    const newValues = handleChangePan(e, cameraRef.current, groundMeshRef.current, panGestureRef.current, cameraWidth, oldCameraX, oldCameraY, azAngle, altAngle);
    if(newValues){
      azAngle = newValues.newAzAngle;
      altAngle = newValues.newAltAngle;
    }
    oldCameraX = e.translationX;
    oldCameraY = e.translationY;
    vX = e.velocityX;
    vY = e.velocityY;
    cameraRef.current?.updateProjectionMatrix();
  }).onEnd(() => {
    cameraInertiaActiveRef.current = true; // Set inertia movement to true
  })

  pinchGestureRef.current = Gesture.Pinch().onTouchesDown((e: GestureTouchEvent) => {
    const angle: number | undefined = handleTouchesDownPinch(e, cameraRef.current, cameraWidth);
    if(angle) startPinchAngle = angle;
  }).onTouchesMove((e: GestureTouchEvent) => {
    handleToucheMovePinch(e, cameraRef.current, cameraWidth, startPinchAngle);
  })

  tapGestureRef.current = Gesture.Tap().maxDuration(250).onStart((e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
    // const raycast = handleStartTap(cameraRef.current, sceneRef.current, starsCatalog, e, pointerMeshRef.current);
    console.log('Single tap!');
  })

  const gestures = Gesture.Simultaneous(panGestureRef.current, pinchGestureRef.current);
  const taps = Gesture.Exclusive(tapGestureRef.current);
  const composed = Gesture.Race(gestures, taps);

  return (
    <GestureHandlerRootView>
      {/*<PlanetariumUI*/}
      {/*  navigation={navigation}*/}
      {/*  infos={null}*/}
      {/*  onShowAzGrid={() => { }}*/}
      {/*  onShowConstellations={() => { }}*/}
      {/*  onShowEqGrid={() => { }}*/}
      {/*  onShowGround={() => { }}*/}
      {/*  onShowPlanets={() => { }}*/}
      {/*  onShowDSO={() => { }}*/}
      {/*  onCenterObject={() => { }}*/}
      {/*/>*/}
      <GestureDetector gesture={composed}>
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
