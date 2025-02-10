import React, {useRef, useState} from 'react';
import {GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSettings} from "../../contexts/AppSettingsContext";
import {useStarCatalog} from "../../contexts/StarsContext";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import PlanetariumUI from "../../components/skymap/PlanetariumUI";
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
import {createEquatorialGrid} from "../../helpers/scripts/astro/skymap/createEquatorialGrid";
import {initGround} from "../../helpers/scripts/astro/skymap/planetarium/initGround";
import {placeCamera} from "../../helpers/scripts/astro/skymap/planetarium/placeCamera";
import {initConstellations} from "../../helpers/scripts/astro/skymap/planetarium/initConstellations";

export default function Planetarium({ route, navigation }: any) {

  // DATA FROM CONTEXTS (STARS, PLANETS, MOON, USER LOCATION)
  const { planets, moonCoords } = useSolarSystem()
  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();

  // GLOBAL STATES RELATED TO THE PLANETARIUM
  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
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

  // PLANETARIUM GLOBAL VARIABLES
  const [equatorialGrid, setEquatorialGrid] = useState<{grid1: THREE.Group, grid2: THREE.Group, grid3: THREE.Group} | null>(null);

  // PLANETARIUM UI CUSTOMIZATION
  const [showEqGrid, setShowEqGrid] = useState<boolean>(false);
  const [showAzGrid, setShowAzGrid] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showGround, setShowGround] = useState<boolean>(true);


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const cameraWidth: number = gl.drawingBufferWidth;
    const cameraHeight: number = gl.drawingBufferHeight;

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

    // Rotate camera locked on the Alt/Az axes
    placeCamera(cameraRef.current, groundMeshRef.current); // PLACE CAMERA

    // ANIMATING SCENE
    animateScene(gl, sceneRef.current, cameraRef.current, rendererRef.current);
    setTimeout(() => setPlanetariumLoading(false), 2000);
  }

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
      {/*<GestureDetector gesture={undefined}>*/}
        <View style={planetariumStyles.container}>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
          {planetariumLoading && (
            <View style={planetariumStyles.loadingScreen}>
              <ActivityIndicator size="large" color={app_colors.white} />
              <Text style={{ color: app_colors.white }}>Loading...</Text>
            </View>
          )}
        </View>
      {/*</GestureDetector>*/}
    </GestureHandlerRootView>
  );
}