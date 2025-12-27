import React, {useState, useRef, useEffect} from 'react';
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
  handlePanStart, inertiaEnabled, setInitialAngles
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
import {useTranslation} from "../../hooks/useTranslation";
import {goTo} from "../../helpers/scripts/planetarium/utils/gotTo";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {DSO} from "../../helpers/types/DSO";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useDsoCatalog} from "../../contexts/DSOContext";
import dayjs from "dayjs";
import {getSunData} from "../../helpers/scripts/astro/solar/sunData";
import {convertSphericalToCartesian} from "../../helpers/scripts/planetarium/utils/convertSphericalToCartesian";
import {meshGroupsNames} from "../../helpers/scripts/planetarium/utils/planetariumSettings";
import {ComputedSunInfos} from "../../helpers/types/objects/ComputedSunInfos";
import {i18n} from "../../helpers/scripts/i18n";

type PlanetariumSelectableObject = Star | GlobalPlanet | DSO | {
  family: 'Sun' | 'Moon';
  name: string;
  ra: number;
  dec: number;
  icon: any;
  phase?: string;
  v_mag?: number;
};

const buildComputedObjectInfosFromSun = (sunData: ComputedSunInfos): ComputedObjectInfos => {
  const visibilityBadge = {
    label: i18n.t('common.visibility.visible'),
    icon: require('../../../assets/icons/FiEye.png'),
    backgroundColor: app_colors.green_eighty,
    foregroundColor: app_colors.white,
  };

  return {
    base: {
      family: 'Planet',
      type: 'Sun',
      rawType: 'Sun',
      name: sunData.base.name,
      otherName: undefined,
      constellation: sunData.base.constellation,
      icon: sunData.base.icon,
      ra: sunData.base.ra,
      dec: sunData.base.dec,
      degRa: sunData.base.ra,
      degDec: sunData.base.dec,
      v_mag: -26,
      b_mag: undefined,
      j_mag: undefined,
      k_mag: undefined,
      h_mag: undefined,
      alt: `${sunData.base.alt.toFixed(2)}°`,
      az: `${Math.round(sunData.base.az)}°`,
    },
    visibilityInfos: {
      isCurrentlyVisible: sunData.visibility.isCurrentlyVisible,
      isCircumpolar: false,
      isVisibleThisNight: sunData.visibility.isVisibleToday,
      visibilityLabel: sunData.visibility.visibilityLabel,
      visibilityBackgroundColor: sunData.visibility.visibilityBackgroundColor,
      visibilityForegroundColor: sunData.visibility.visibilityForegroundColor,
      visibilityIcon: sunData.visibility.visibilityIcon,
      objectNextRise: sunData.visibility.sunrise,
      objectNextSet: sunData.visibility.sunset,
      nakedEye: visibilityBadge,
      binoculars: visibilityBadge,
      telescope: visibilityBadge,
      visibilityGraph: sunData.visibility.visibilityGraph
    },
    dsoAdditionalInfos: undefined,
    planetAdditionalInfos: undefined,
    error: '',
  };
};

export default function Planetarium({ route, navigation }: any) {

  const { currentLocale } = useTranslation();
  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const { planets, moonCoords } = useSolarSystem()
  const { dsoCatalog } = useDsoCatalog();
  const dsoCatalogRef = useRef<DSO[]>([]);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const selectionCircleRef = useRef<THREE.Line | null>(null);
  const azGridRef = useRef<THREE.Group | null>(null);
  const eqGridRef = useRef<THREE.Group | null>(null);
  const groundTotalQuaternionRef = useRef<THREE.Quaternion | null>(null);

  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
  const [glViewParams, setGlViewParams] = useState<any>({width: 0, height: 0});
  const [objectInfos, setObjectInfos] = useState<PlanetariumSelectableObject | null>(null);
  const [computedObjectInfos, setComputedObjectInfos] = useState<ComputedObjectInfos | null>(null);

  useEffect(() => {
    StatusBar.setHidden(true);

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    dsoCatalogRef.current = dsoCatalog;
  }, [dsoCatalog]);

  useEffect(() => {
    return () => {
      shutdownPlanetarium(sceneRef.current!)
    }
  }, []);

  useEffect(() => {
    if(!objectInfos || !currentUserLocation) {
      setComputedObjectInfos(null);
      return;
    }

    const observer: { latitude: number, longitude: number } = {
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lon
    };

    if ('family' in objectInfos && objectInfos.family === 'Sun') {
      const sunData = getSunData(dayjs(), observer);
      setComputedObjectInfos(buildComputedObjectInfosFromSun(sunData));
      return;
    }

    setComputedObjectInfos(computeObject({
      object: objectInfos,
      observer: observer,
      lang: currentLocale,
    }));
  }, [objectInfos, currentLocale, currentUserLocation])

  useEffect(() => {
    if (!sceneRef.current) return;
    const planetsGroup = sceneRef.current.getObjectByName(meshGroupsNames.planets) as THREE.Group | null;
    if (!planetsGroup) return;

    planetsGroup.children.forEach((child) => {
      const planetData = planets.find((planet: GlobalPlanet) => planet.name === child.name);
      if (!planetData) return;
      const { x, y, z } = convertSphericalToCartesian(9.9, planetData.ra, planetData.dec);
      child.position.set(x, y, z);
    });
  }, [planets]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const moonGroup = sceneRef.current.getObjectByName(meshGroupsNames.moon) as THREE.Group | null;
    if (!moonGroup) return;
    const moonMesh = moonGroup.children.find((child) => child.userData?.type === 'moon') as THREE.Mesh | undefined;
    if (!moonMesh) return;

    const { x, y, z } = convertSphericalToCartesian(9.8, moonCoords.ra, moonCoords.dec);
    moonMesh.position.set(x, y, z);
  }, [moonCoords]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const sunMesh = sceneRef.current.getObjectByName(meshGroupsNames.sun) as THREE.Mesh | null;
    if (!sunMesh) return;

    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const sunData = getSunData(dayjs(), observer);
    const { x, y, z } = convertSphericalToCartesian(9.6, sunData.base.ra, sunData.base.dec);
    sunMesh.position.set(x, y, z);
    sunMesh.userData.onTap = () => {
      const updatedSunData = getSunData(dayjs(), observer);
      const sunInfo: PlanetariumSelectableObject = {
        family: 'Sun',
        name: updatedSunData.base.name,
        ra: updatedSunData.base.ra,
        dec: updatedSunData.base.dec,
        icon: updatedSunData.base.icon,
        v_mag: -26,
      };
      setObjectInfos(sunInfo);
      setComputedObjectInfos(buildComputedObjectInfosFromSun(updatedSunData));
    };
  }, [currentUserLocation, currentLocale]);

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const observer = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon};
    const sunData = getSunData(dayjs(), observer);

    const {scene, camera, renderer, ground, selectionCircle, atmosphere, grids, quaternions} = initScene(
      gl,
      currentUserLocation,
      starsCatalog.filter((star: Star) => star.V < 6),
      planets,
      moonCoords,
      () => dsoCatalogRef.current,
      sunData,
      setObjectInfos,
      currentLocale,
      observer
    );
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    groundRef.current = ground;
    atmosphereRef.current = atmosphere;
    selectionCircleRef.current = selectionCircle;
    azGridRef.current = grids.azGrid;
    eqGridRef.current = grids.eqGrid;
    groundTotalQuaternionRef.current = quaternions.groundTotalQuaternion;

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
    .onEnd((e) => handleTapStart(e, sceneRef, cameraRef, selectionCircleRef, setObjectInfos));


  const movementGestures: SimultaneousGesture = Gesture.Simultaneous(panGesture, pinchGesture);
  const actionGestures: ExclusiveGesture = Gesture.Exclusive(tapGesture);
  const composedGestures: ComposedGesture = Gesture.Race(movementGestures, actionGestures)

  return (
    <GestureHandlerRootView>
      {
        !planetariumLoading &&
          <PlanetariumUI
              navigation={navigation}
              infos={computedObjectInfos ? computedObjectInfos : null}
              onShowAzGrid={() => onShowAzGrid(sceneRef.current!)}
              onShowConstellations={() => onShowConstellations(sceneRef.current!)}
              onShowEqGrid={() => onShowEqGrid(sceneRef.current!)}
              onShowGround={() => onShowGround(sceneRef.current!)}
              onShowPlanets={() => onShowPlanets(sceneRef.current!)}
              onShowDSO={() => onShowDSO(sceneRef.current!)}
              onCenterObject={() =>
                goTo(
                  computedObjectInfos?.base.degRa,
                  computedObjectInfos?.base.degDec,
                  cameraRef.current!,
                  groundRef.current!,
                  setInitialAngles
                )
              }
          />
      }
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
