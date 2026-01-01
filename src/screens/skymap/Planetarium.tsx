import React, {useState, useRef, useEffect, useCallback} from 'react';
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
  azAngle,
  altAngle,
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
  onShowConstellations, onShowConstellationLabels, onShowDSO,
  onShowEqGrid,
  onShowGround, onShowPlanets, onShowCompassLabels
} from "../../helpers/scripts/planetarium/ui/toggle";
import {useTranslation} from "../../hooks/useTranslation";
import {goTo} from "../../helpers/scripts/planetarium/utils/gotTo";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {DSO} from "../../helpers/types/DSO";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useDsoCatalog} from "../../contexts/DSOContext";
import dayjs, {Dayjs} from "dayjs";
import {getSunData} from "../../helpers/scripts/astro/solar/sunData";
import {convertSphericalToCartesian} from "../../helpers/scripts/planetarium/utils/convertSphericalToCartesian";
import {meshGroupsNames} from "../../helpers/scripts/planetarium/utils/planetariumSettings";
import {ComputedSunInfos} from "../../helpers/types/objects/ComputedSunInfos";
import {i18n} from "../../helpers/scripts/i18n";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import {Polaris} from "../../helpers/constants";
import {updateCompassLabels} from "../../helpers/scripts/planetarium/createCompassLabels";
import {updateConstellationLabelSizes} from "../../helpers/scripts/planetarium/createConstellationLabels";
import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  getLunarEquatorialCoordinate,
  getLunarPhase,
  getPlanetaryPositions,
  HorizontalCoordinate
} from "@observerly/astrometry";
import {moonIcons} from "../../helpers/scripts/loadImages";
import {convertHorizontalToEquatorial} from "@observerly/astrometry";

type PlanetariumSelectableObject = Star | GlobalPlanet | DSO | {
  family: 'Sun' | 'Moon';
  name: string;
  ra: number;
  dec: number;
  icon: any;
  phase?: string;
  v_mag?: number;
};

type MoonDetails = EquatorialCoordinate & HorizontalCoordinate & { phase: string; currentIconUrl?: string };

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
  const atmosphereEnabledRef = useRef<boolean>(true);
  const lastSunDataRef = useRef<ComputedSunInfos | null>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const selectionCircleRef = useRef<THREE.Object3D | null>(null);
  const azGridRef = useRef<THREE.Group | null>(null);
  const eqGridRef = useRef<THREE.Group | null>(null);
  const compassLabelsRef = useRef<THREE.Group | null>(null);
  const constellationLabelsRef = useRef<THREE.Group | null>(null);
  const groundTotalQuaternionRef = useRef<THREE.Quaternion | null>(null);

  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);
  const [glViewParams, setGlViewParams] = useState<any>({width: 0, height: 0});
  const [objectInfos, setObjectInfos] = useState<PlanetariumSelectableObject | null>(null);
  const [computedObjectInfos, setComputedObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [computedSource, setComputedSource] = useState<PlanetariumSelectableObject | null>(null);
  const [shouldFocusSelection, setShouldFocusSelection] = useState<boolean>(false);
  const initialSelectionHandled = useRef<boolean>(false);
  const [followSelection, setFollowSelection] = useState<boolean>(false);
  const [referenceDate, setReferenceDate] = useState<Dayjs>(dayjs());
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(true);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [planetsAtDate, setPlanetsAtDate] = useState<GlobalPlanet[]>(planets);
  const [moonAtDate, setMoonAtDate] = useState<MoonDetails>(moonCoords as MoonDetails);
  const [sunDataAtDate, setSunDataAtDate] = useState<ComputedSunInfos | null>(null);

  const normalizeKey = useCallback((value: string | number | undefined | null) => `${value ?? ''}`.toLowerCase().replace(/[^a-z0-9]/g, ''), []);
  const toggleFollow = useCallback(() => setFollowSelection((prev) => !prev), []);

  const buildDsoMeshKey = useCallback((dso: DSO) => {
    const digits = (input: string | number | undefined | null) => `${input ?? ''}`.replace(/\D/g, '');

    const mKey = digits(dso.m);
    if (mKey) return `m${mKey}`;

    const ngcKey = digits(dso.ngc);
    if (ngcKey) return `n${ngcKey}`;

    const icKey = digits(dso.ic);
    if (icKey) return `ic${icKey}`;

    const identifierKey = normalizeKey(dso.identifiers);
    if (identifierKey) return identifierKey;

    return normalizeKey(dso.name);
  }, [normalizeKey]);

  const resolveSelectableObject = useCallback((rawObject: PlanetariumSelectableObject) => {
    const explicitFamily = (rawObject as any).family;
    if (explicitFamily === 'Sun' || explicitFamily === 'Moon') {
      return rawObject;
    }

    const family = getObjectFamily(rawObject as any);

    if (family === 'Planet') {
      const normalizedName = normalizeKey((rawObject as GlobalPlanet).name);
      return planetsAtDate.find((planet: GlobalPlanet) => normalizeKey(planet.name) === normalizedName) || rawObject;
    }

    if (family === 'DSO') {
      const targetKey = buildDsoMeshKey(rawObject as DSO);
      const catalogMatch = dsoCatalog.find((dso: DSO) => buildDsoMeshKey(dso) === targetKey || normalizeKey(dso.name) === normalizeKey((rawObject as DSO).name));
      return catalogMatch || rawObject;
    }

    if (family === 'Star') {
      return starsCatalog.find((star: Star) => star.ids === (rawObject as Star).ids) || rawObject;
    }

    return rawObject;
  }, [planetsAtDate, dsoCatalog, starsCatalog, normalizeKey, buildDsoMeshKey]);

  const determineFamily = (obj: PlanetariumSelectableObject) => {
    if ('family' in obj && (obj.family === 'Sun' || obj.family === 'Moon')) {
      return obj.family;
    }
    return getObjectFamily(obj as any);
  };

  const applyFullVisibility = useCallback(() => {
    if (!sceneRef.current) return;
    const stars = sceneRef.current.getObjectByName(meshGroupsNames.stars) as THREE.Points | null;
    const dsoGroup = sceneRef.current.getObjectByName(meshGroupsNames.dso) as THREE.Group | null;
    const background = sceneRef.current.getObjectByName(meshGroupsNames.background) as THREE.Mesh | null;

    if (stars && stars.material instanceof THREE.ShaderMaterial && (stars.material as THREE.ShaderMaterial).uniforms?.uNightFactor) {
      const mat = stars.material as THREE.ShaderMaterial;
      mat.uniforms.uNightFactor.value = 1;
    }

    if (background && background.material instanceof THREE.MeshBasicMaterial) {
      const mat = background.material as THREE.MeshBasicMaterial;
      mat.opacity = 1;
      mat.transparent = true;
    }

    if (dsoGroup) {
      dsoGroup.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.material) return;

        const applyOpacity = (material: THREE.Material) => {
          const shaderMat = material as THREE.ShaderMaterial;
          if ((shaderMat as THREE.ShaderMaterial).uniforms?.uVisibility) {
            (shaderMat.uniforms as any).uVisibility.value = 1;
          } else {
            shaderMat.opacity = 1;
          }
          shaderMat.transparent = true;
          shaderMat.needsUpdate = true;
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => applyOpacity(mat));
        } else {
          applyOpacity(mesh.material);
        }
      });
    }
  }, []);

  const updateAtmosphereAndVisibility = useCallback((sunData: ComputedSunInfos) => {
    lastSunDataRef.current = sunData;
    if (!sceneRef.current) return;

    if (!atmosphereEnabledRef.current) {
      applyFullVisibility();
      return;
    }

    const atmosphere = atmosphereRef.current;
    const stars = sceneRef.current.getObjectByName(meshGroupsNames.stars) as THREE.Points | null;
    const dsoGroup = sceneRef.current.getObjectByName(meshGroupsNames.dso) as THREE.Group | null;
    const background = sceneRef.current.getObjectByName(meshGroupsNames.background) as THREE.Mesh | null;

    const sunDirection = convertSphericalToCartesian(1, sunData.base.ra, sunData.base.dec).normalize();
    const sunAltitude = sunData.base.alt;

    const dayMix = THREE.MathUtils.clamp((sunAltitude + 6) / 12, 0, 1);
    const twilight = THREE.MathUtils.clamp(1 - Math.abs(sunAltitude) / 8, 0, 1);
    const nightFactor = THREE.MathUtils.clamp(-sunAltitude / 15, 0, 1);
    const dsoVisibility = THREE.MathUtils.clamp((nightFactor - 0.35) / 0.65, 0, 1);

    if (atmosphere && atmosphere.material instanceof THREE.ShaderMaterial) {
      const mat = atmosphere.material as THREE.ShaderMaterial;
      if (mat.uniforms.uSunDirection?.value) {
        (mat.uniforms.uSunDirection.value as THREE.Vector3).copy(sunDirection);
      }
      if (mat.uniforms.uMixDay) {
        mat.uniforms.uMixDay.value = dayMix;
      }
      if (mat.uniforms.uTwilight) {
        mat.uniforms.uTwilight.value = twilight;
      }
      if (mat.uniforms.uBaseOpacity) {
        mat.uniforms.uBaseOpacity.value = THREE.MathUtils.lerp(0.25, 0.75, Math.max(dayMix, twilight));
      }
    }

    if (stars && stars.material instanceof THREE.ShaderMaterial && (stars.material as THREE.ShaderMaterial).uniforms?.uNightFactor) {
      const mat = stars.material as THREE.ShaderMaterial;
      mat.uniforms.uNightFactor.value = nightFactor;
    }

    if (background && background.material instanceof THREE.MeshBasicMaterial) {
      const mat = background.material as THREE.MeshBasicMaterial;
      mat.opacity = nightFactor;
      mat.transparent = true;
    }

    if (dsoGroup) {
      dsoGroup.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.material) return;

        const applyOpacity = (material: THREE.Material) => {
          const shaderMat = material as THREE.ShaderMaterial;
          if ((shaderMat as THREE.ShaderMaterial).uniforms?.uVisibility) {
            (shaderMat.uniforms as any).uVisibility.value = dsoVisibility;
          } else {
            shaderMat.opacity = dsoVisibility;
          }
          shaderMat.transparent = true;
          shaderMat.needsUpdate = true;
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => applyOpacity(mat));
        } else {
          applyOpacity(mesh.material);
        }
      });
    }
  }, [applyFullVisibility]);

  const findSceneTarget = useCallback((obj: PlanetariumSelectableObject): THREE.Object3D | null => {
    if (!sceneRef.current) return null;
    const family = determineFamily(obj);

    if (family === 'Planet') {
      const planetsGroup = sceneRef.current.getObjectByName(meshGroupsNames.planets) as THREE.Group | null;
      const normalizedName = normalizeKey((obj as GlobalPlanet).name);
      return planetsGroup?.children.find((child) => normalizeKey(child.name) === normalizedName) || null;
    }

    if (family === 'Sun') {
      return sceneRef.current.getObjectByName(meshGroupsNames.sun) as THREE.Object3D | null;
    }

    if (family === 'Moon') {
      const moonGroup = sceneRef.current.getObjectByName(meshGroupsNames.moon) as THREE.Group | null;
      return moonGroup?.children.find((child) => child.userData?.type === 'moon') || moonGroup || null;
    }

    if (family === 'DSO') {
      const targetKey = buildDsoMeshKey(obj as DSO);
      let target: THREE.Object3D | null = null;

      sceneRef.current.traverse((child) => {
        if (target) return;
        if (child.userData?.type === 'dso' && normalizeKey(child.userData.index) === targetKey) {
          target = child;
        }
      });

      return target;
    }

    if (family === 'Star') {
      const baseRa = (obj as Star).ra ?? computedObjectInfos?.base.degRa;
      const baseDec = (obj as Star).dec ?? computedObjectInfos?.base.degDec;
      if (baseRa != null && baseDec != null) {
        const pos = convertSphericalToCartesian(10, baseRa, baseDec);
        const proxy = new THREE.Object3D();
        proxy.position.copy(pos);
        return proxy;
      }
    }

    return null;
  }, [buildDsoMeshKey, normalizeKey, computedObjectInfos?.base.degRa, computedObjectInfos?.base.degDec]);

  const updateSelectionCircle = useCallback((target: THREE.Object3D | null, family: string) => {
    const selectionCircle = selectionCircleRef.current;
    const camera = cameraRef.current;

    if (!selectionCircle || !camera) return;
    if (!target) {
      selectionCircle.visible = false;
      return;
    }

    const point = new THREE.Vector3();

    const setScale = (x: number, y: number, z: number) => {
      selectionCircle.userData.baseScale = { x, y, z };
      selectionCircle.scale.set(x, y, z);
    };

    if (family === 'dso' && target.userData?.corners) {
      const corners: THREE.Vector3[] = target.userData.corners;
      if (corners.length === 4) {
        const center = new THREE.Vector3();
        corners.forEach((corner) => center.add(corner));
        center.divideScalar(corners.length);

        const majorAxis = new THREE.Vector3().subVectors(corners[2], corners[0]).length() / 2;
        const minorAxis = new THREE.Vector3().subVectors(corners[1], corners[0]).length() / 2;

        selectionCircle.position.copy(center);
        setScale(majorAxis * 1.1, minorAxis * 1.1, 1);
        selectionCircle.lookAt(camera.position);
        selectionCircle.visible = true;
        return;
      }
    }

    target.getWorldPosition(point);
    // Estimate object extent
    let radius = 0.4;
    const mesh = target as any;
    if (mesh.geometry && typeof mesh.geometry.computeBoundingSphere === 'function') {
      mesh.geometry.computeBoundingSphere();
      if (mesh.geometry.boundingSphere?.radius) {
        const uniformScale = mesh.scale ? Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z) : 1;
        radius = mesh.geometry.boundingSphere.radius * uniformScale;
      }
    }

    if (family === 'star') {
      const starScale = 0.22;
      selectionCircle.position.copy(point);
      setScale(starScale, starScale, starScale);
      selectionCircle.lookAt(camera.position);
      selectionCircle.visible = true;
      return;
    }

    const padding = family === 'planet' || family === 'sun' || family === 'moon' ? 2.2 : 1.6;
    const baseScale = Math.max(0.25, radius * padding);

    selectionCircle.position.copy(point);
    setScale(baseScale, baseScale, baseScale);
    selectionCircle.lookAt(camera.position);
    selectionCircle.visible = true;
  }, []);

  const adjustCameraFovForTarget = useCallback((target: THREE.Object3D | null, family: string) => {
    const camera = cameraRef.current;
    if (!camera || !target || family === 'star') return;

    const box = new THREE.Box3().setFromObject(target);
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    if (!sphere || !sphere.radius) return;

    const distance = sphere.center.length();
    const aspect = camera.aspect || (glViewParams.width && glViewParams.height ? glViewParams.width / glViewParams.height : 1);
    const requiredRadius = Math.max(sphere.radius, sphere.radius / aspect);
    const fovRad = 2 * Math.atan(requiredRadius / distance);
    const fovDeg = THREE.MathUtils.radToDeg(fovRad) * 1.2; // small margin so the image fills the width
    const clampedFov = Math.min(85, Math.max(10, fovDeg));

    camera.fov = clampedFov;
    camera.updateProjectionMatrix();
  }, [glViewParams.height, glViewParams.width]);

  const focusOnObject = useCallback((rawObject: PlanetariumSelectableObject, infos: ComputedObjectInfos) => {
    const camera = cameraRef.current;
    const ground = groundRef.current;
    if (!camera || !ground) return;

    goTo(
      infos.base.degRa,
      infos.base.degDec,
      camera,
      ground,
      setInitialAngles
    );

    const family = determineFamily(rawObject);
    const normalizedFamily = `${family ?? ''}`.toLowerCase();
    const target = findSceneTarget(rawObject);

    if (target) {
      updateSelectionCircle(target, normalizedFamily);
      adjustCameraFovForTarget(target, normalizedFamily);
    }
  }, [adjustCameraFovForTarget, findSceneTarget, updateSelectionCircle]);

  const handleCenterObject = useCallback(() => {
    if (objectInfos && computedObjectInfos) {
      focusOnObject(objectInfos, computedObjectInfos);
    }
  }, [computedObjectInfos, focusOnObject, objectInfos]);

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
    if (!currentUserLocation) return;

    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const safeDate = referenceDate && referenceDate.isValid() ? referenceDate : dayjs();

    setSunDataAtDate(getSunData(safeDate, observer));
    setPlanetsAtDate(getPlanetaryPositions(safeDate.toDate(), observer));

    const eq = getLunarEquatorialCoordinate(safeDate.toDate());
    const horizontal = convertEquatorialToHorizontal(safeDate.toDate(), observer, { ra: eq.ra, dec: eq.dec });
    const phase = getLunarPhase(safeDate.toDate());

    setMoonAtDate({
      ra: eq.ra,
      dec: eq.dec,
      alt: horizontal.alt,
      az: horizontal.az,
      phase,
      currentIconUrl: (moonCoords as MoonDetails)?.currentIconUrl
    });
  }, [currentUserLocation, moonCoords, referenceDate]);

  useEffect(() => {
    if (!isTimelinePlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }

    playIntervalRef.current = setInterval(() => {
      setReferenceDate((prev) => (prev && prev.isValid() ? prev.add(1, 'second') : dayjs().add(1, 'second')));
    }, 1000);

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isTimelinePlaying]);

  const realignSceneToReferenceDate = useCallback(() => {
    if (!groundRef.current || !cameraRef.current) return;
    const referenceDateAsDate = referenceDate.toDate();
    const zenithEq = convertHorizontalToEquatorial(referenceDateAsDate, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 90, az: 0 });
    const northEq = convertHorizontalToEquatorial(referenceDateAsDate, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 0, az: 0 });
    const zenithVec = convertSphericalToCartesian(5, zenithEq.ra, zenithEq.dec);
    const northVec = convertSphericalToCartesian(5, northEq.ra, northEq.dec).normalize();

    groundRef.current.up.copy(northVec);
    groundRef.current.lookAt(zenithVec);
    groundRef.current.userData.baseQuaternion = groundRef.current.quaternion.clone();

    const baseQ = groundRef.current.userData.baseQuaternion as THREE.Quaternion;
    const q1 = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();
    const y1 = new THREE.Vector3(0, 0, 1);
    const x1 = new THREE.Vector3(1, 0, 0);
    q1.setFromAxisAngle(y1, azAngle);
    q2.setFromAxisAngle(x1, altAngle);

    const groundTotalQuaternion = baseQ.clone().multiply(q1).multiply(q2);
    if (!groundTotalQuaternionRef.current) {
      groundTotalQuaternionRef.current = new THREE.Quaternion();
    }
    groundTotalQuaternionRef.current.copy(groundTotalQuaternion);

    cameraRef.current.setRotationFromQuaternion(groundTotalQuaternion.normalize());

    if (azGridRef.current) {
      azGridRef.current.up.copy(northVec);
      azGridRef.current.lookAt(zenithVec);
    }

    if (compassLabelsRef.current) {
      updateCompassLabels(compassLabelsRef.current, currentUserLocation, referenceDateAsDate, 0.98);
    }
  }, [currentUserLocation.lat, currentUserLocation.lon, referenceDate]);

  useEffect(() => {
    return () => {
      shutdownPlanetarium(sceneRef.current!)
    }
  }, []);

  useEffect(() => {
    if (planetariumLoading) return;
    realignSceneToReferenceDate();
  }, [planetariumLoading, realignSceneToReferenceDate]);

  useEffect(() => {
    if (!objectInfos || !computedObjectInfos) return;
    const target = findSceneTarget(objectInfos);
    const family = determineFamily(objectInfos);
    const normalizedFamily = `${family ?? ''}`.toLowerCase();

    updateSelectionCircle(target, normalizedFamily);

    if (followSelection && groundRef.current && cameraRef.current) {
      goTo(
        computedObjectInfos.base.degRa,
        computedObjectInfos.base.degDec,
        cameraRef.current,
        groundRef.current,
        setInitialAngles
      );
      if (target) {
        adjustCameraFovForTarget(target, normalizedFamily);
      }
    }
  }, [referenceDate, objectInfos, computedObjectInfos, followSelection, findSceneTarget, determineFamily, updateSelectionCircle, adjustCameraFovForTarget]);

  useEffect(() => {
    if(!objectInfos || !currentUserLocation) {
      setComputedObjectInfos(null);
      setComputedSource(null);
      setFollowSelection(false);
      return;
    }

    const observer: { latitude: number, longitude: number } = {
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lon
    };

    if ('family' in objectInfos && objectInfos.family === 'Sun') {
      const sunData = getSunData(referenceDate, observer);
      setComputedObjectInfos(buildComputedObjectInfosFromSun(sunData));
      setComputedSource(objectInfos);
      return;
    }

    setComputedObjectInfos(computeObject({
      object: objectInfos,
      observer: observer,
      lang: currentLocale,
      date: referenceDate,
    }));
    setComputedSource(objectInfos);
  }, [objectInfos, currentLocale, currentUserLocation, referenceDate])

  useEffect(() => {
    if (!sceneRef.current) return;
    const planetsGroup = sceneRef.current.getObjectByName(meshGroupsNames.planets) as THREE.Group | null;
    if (!planetsGroup) return;

    planetsGroup.children.forEach((child) => {
      const planetData = planetsAtDate.find((planet: GlobalPlanet) => planet.name === child.name);
      if (!planetData) return;
      const { x, y, z } = convertSphericalToCartesian(9.9, planetData.ra, planetData.dec);
      child.position.set(x, y, z);
      child.userData = {
        ...(child.userData || {}),
        onTap: () => {
          setObjectInfos(planetData);
        }
      };
    });
  }, [planetsAtDate]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const moonGroup = sceneRef.current.getObjectByName(meshGroupsNames.moon) as THREE.Group | null;
    if (!moonGroup) return;
    const moonMesh = moonGroup.children.find((child) => child.userData?.type === 'moon') as THREE.Mesh | undefined;
    if (!moonMesh) return;

    const { x, y, z } = convertSphericalToCartesian(9.8, moonAtDate.ra, moonAtDate.dec);
    moonMesh.position.set(x, y, z);
    moonMesh.userData = {
      ...(moonMesh.userData || {}),
      onTap: () => {
        setObjectInfos({
          family: 'Moon',
          name: 'Moon',
          ra: moonAtDate.ra,
          dec: moonAtDate.dec,
          icon: moonAtDate.currentIconUrl ? { uri: moonAtDate.currentIconUrl } : moonIcons[moonAtDate.phase] || moonIcons['Full'],
          phase: moonAtDate.phase,
        });
      }
    };
  }, [moonAtDate]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const sunMesh = sceneRef.current.getObjectByName(meshGroupsNames.sun) as THREE.Mesh | null;
    if (!sunMesh) return;

    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const sunData = sunDataAtDate ?? getSunData(referenceDate, observer);
    const { x, y, z } = convertSphericalToCartesian(9.6, sunData.base.ra, sunData.base.dec);
    sunMesh.position.set(x, y, z);
    updateAtmosphereAndVisibility(sunData);
    sunMesh.userData.onTap = () => {
      const updatedSunData = getSunData(referenceDate, observer);
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
  }, [currentUserLocation, currentLocale, referenceDate, sunDataAtDate, updateAtmosphereAndVisibility]);

  useEffect(() => {
    if (initialSelectionHandled.current) return;

    if (route?.params?.defaultObject) {
      const resolvedObject = resolveSelectableObject(route.params.defaultObject);
      setObjectInfos(resolvedObject);
      setShouldFocusSelection(true);
      initialSelectionHandled.current = true;
      return;
    }

    if (!starsCatalog || starsCatalog.length === 0) return;

    const polarisFromCatalog = starsCatalog.find((star: Star) =>
      Math.abs(star.ra - Polaris.ra) < 0.2 && Math.abs(star.dec - Polaris.dec) < 0.2
    );

    const fallbackPolaris: Star = {
      ids: 'NAME Polaris',
      ra: Polaris.ra,
      dec: Polaris.dec,
      V: 1.98,
      sp_type: 'F7',
    };

    setObjectInfos(polarisFromCatalog || fallbackPolaris);
    setShouldFocusSelection(true);
    initialSelectionHandled.current = true;
  }, [resolveSelectableObject, route?.params?.defaultObject, starsCatalog]);

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const observer = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon};
    const sunData = sunDataAtDate ?? getSunData(referenceDate, observer);

    const {scene, camera, renderer, ground, selectionCircle, atmosphere, grids, compassLabels, quaternions} = initScene(
      gl,
      currentUserLocation,
      starsCatalog.filter((star: Star) => star.V < 6),
      planetsAtDate,
      moonAtDate,
      () => dsoCatalogRef.current,
      sunData,
      setObjectInfos,
      currentLocale,
      observer,
      referenceDate
    );
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    groundRef.current = ground;
    atmosphereRef.current = atmosphere;
    selectionCircleRef.current = selectionCircle;
    azGridRef.current = grids.azGrid;
    eqGridRef.current = grids.eqGrid;
    compassLabelsRef.current = compassLabels;
    constellationLabelsRef.current = scene.getObjectByName(meshGroupsNames.constellationLabels) as THREE.Group | null;
    groundTotalQuaternionRef.current = quaternions.groundTotalQuaternion;

    updateAtmosphereAndVisibility(sunData);
    setGlViewParams({width: gl.drawingBufferWidth, height: gl.drawingBufferHeight});
    setPlanetariumLoading(false);

    const animate = () => {

      requestAnimationFrame(animate);

      if (inertiaEnabled) {
        applyInertia(cameraRef, groundRef, gl.drawingBufferWidth);
      }

      if (selectionCircleRef.current?.visible && selectionCircleRef.current.userData?.baseScale) {
        const pulse = 1 + 0.06 * Math.sin(performance.now() * 0.006);
        const { x, y, z } = selectionCircleRef.current.userData.baseScale;
        selectionCircleRef.current.scale.set(x * pulse, y * pulse, z * pulse);
      }

      if (constellationLabelsRef.current && cameraRef.current) {
        updateConstellationLabelSizes(constellationLabelsRef.current, cameraRef.current);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    animate();
  };

  useEffect(() => {
    if (!shouldFocusSelection) return;
    if (!objectInfos || !computedObjectInfos) return;
    if (computedSource !== objectInfos) return;
    if (!cameraRef.current || !groundRef.current || !sceneRef.current) return;
    if (planetariumLoading) return;

    focusOnObject(objectInfos, computedObjectInfos);
    setShouldFocusSelection(false);
  }, [computedObjectInfos, computedSource, focusOnObject, objectInfos, planetariumLoading, shouldFocusSelection]);

  const panGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (followSelection) setFollowSelection(false);
      handlePanStart(e);
    })
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
    .onTouchesDown((e: GestureTouchEvent) => {
      if (followSelection) setFollowSelection(false);
      handlePinchTouchDown(e, cameraRef, glViewParams.width);
    })
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
              onSelectObject={(obj) => {
                const resolved = resolveSelectableObject(obj as PlanetariumSelectableObject);
                setObjectInfos(resolved);
                setShouldFocusSelection(true);
              }}
              onShowAzGrid={() => onShowAzGrid(sceneRef.current!)}
              onShowConstellations={() => onShowConstellations(sceneRef.current!)}
              onShowConstellationLabels={() => onShowConstellationLabels(sceneRef.current!)}
              onShowEqGrid={() => onShowEqGrid(sceneRef.current!)}
              onShowGround={() => onShowGround(sceneRef.current!)}
              onShowPlanets={() => onShowPlanets(sceneRef.current!)}
              onShowDSO={() => onShowDSO(sceneRef.current!)}
              onShowCompassLabels={() => onShowCompassLabels(sceneRef.current!)}
              onCenterObject={handleCenterObject}
              isFollowing={followSelection}
              onToggleFollow={toggleFollow}
              timelineDate={referenceDate}
              isTimelinePlaying={isTimelinePlaying}
              onToggleTimelinePlay={() => setIsTimelinePlaying((prev) => !prev)}
              onChangeTimelineDate={(next) => {
                setReferenceDate(next);
              }}
              onResetTimelineDate={() => {
                setIsTimelinePlaying(true);
                setReferenceDate(dayjs());
              }}
              onShowAtmosphere={() => {
                if (!sceneRef.current) return;
                const atmosphere = atmosphereRef.current;
                if (!atmosphere) return;
                const nextVisible = !atmosphere.visible;
                atmosphere.visible = nextVisible;
                atmosphereEnabledRef.current = nextVisible;

                if (!nextVisible) {
                  applyFullVisibility();
                } else {
                  const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
                  const sunData = lastSunDataRef.current ?? getSunData(referenceDate, observer);
                  updateAtmosphereAndVisibility(sunData);
                }
              }}
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
