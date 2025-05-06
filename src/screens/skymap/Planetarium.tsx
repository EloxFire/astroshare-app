import React, { useState, useRef, useEffect } from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import { planetariumStyles } from '../../styles/screens/skymap/planetarium';
import {ComposedGesture, ExclusiveGesture, Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, GestureTouchEvent, GestureUpdateEvent, PanGestureChangeEventPayload, PanGestureHandlerEventPayload, SimultaneousGesture, TapGestureHandlerEventPayload} from 'react-native-gesture-handler';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext';
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { useStarCatalog } from '../../contexts/StarsContext';
import PlanetariumUI from "../../components/skymap/PlanetariumUI";
import {app_colors} from "../../helpers/constants";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {initScene} from "../../helpers/scripts/planetarium/initScene";
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
import {shutdownPlanetarium} from "../../helpers/scripts/planetarium/shutdownPlanetarium";
import {
  onShowAzGrid,
  onShowConstellations, onShowDSO,
  onShowEqGrid,
  onShowGround, onShowPlanets
} from "../../helpers/scripts/planetarium/ui/toggle";

export default function Planetarium({ route, navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const {planets, moonCoords} = useSolarSystem()

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const selectionCircleRef = useRef<THREE.Line | null>(null);
  const azGridRef = useRef<THREE.Group | null>(null);
  const eqGridRef = useRef<THREE.Group | null>(null);

  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
  const [glViewParams, setGlViewParams] = useState<any>({width: 0, height: 0});

  useEffect(() => {
    StatusBar.setHidden(true);

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      shutdownPlanetarium(sceneRef.current!)
    }
  }, []);


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const {scene, camera, renderer, ground, selectionCircle, atmosphere, grids} = initScene(gl, currentUserLocation, starsCatalog.filter((star: Star) => star.V < 6), planets, moonCoords);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    groundRef.current = ground;
    atmosphereRef.current = atmosphere;
    selectionCircleRef.current = selectionCircle;
    azGridRef.current = grids.azGrid;
    eqGridRef.current = grids.eqGrid;

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

  return (
    <GestureHandlerRootView>
      <PlanetariumUI
        navigation={navigation}
        infos={null}
        onShowAzGrid={() => onShowAzGrid(sceneRef.current!)}
        onShowConstellations={() => onShowConstellations(sceneRef.current!)}
        onShowEqGrid={() => onShowEqGrid(sceneRef.current!)}
        onShowGround={() => onShowGround(sceneRef.current!)}
        onShowPlanets={() => onShowPlanets(sceneRef.current!)}
        onShowDSO={() => onShowDSO(sceneRef.current!)}
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