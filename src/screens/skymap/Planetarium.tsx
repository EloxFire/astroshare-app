import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, PixelRatio, ScrollView, StatusBar, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureStateChangeEvent,
  GestureTouchEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as THREE from 'three';
import dayjs, { Dayjs } from 'dayjs';
import {
  convertEquatorialToHorizontal,
  convertHorizontalToEquatorial,
  getLunarEquatorialCoordinate,
  getLunarPhase,
  getPlanetaryPositions,
} from '@observerly/astrometry';

import { useSettings } from '../../contexts/AppSettingsContext';
import { useStarCatalog } from '../../contexts/StarsContext';
import { useSolarSystem } from '../../contexts/SolarSystemContext';
import { useDsoCatalog } from '../../contexts/DSOContext';
import { useTranslation } from '../../hooks/useTranslation';

import { app_colors } from '../../helpers/constants';
import { i18n } from '../../helpers/scripts/i18n';
import { getSunData } from '../../helpers/scripts/astro/solar/sunData';
import { computeObject } from '../../helpers/scripts/astro/objects/computeObject';
import { getObjectFamily } from '../../helpers/scripts/astro/objects/getObjectFamily';

import { Star } from '../../helpers/types/Star';
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet';
import { DSO } from '../../helpers/types/DSO';
import { ComputedObjectInfos } from '../../helpers/types/objects/ComputedObjectInfos';
import { ComputedSunInfos } from '../../helpers/types/objects/ComputedSunInfos';

import { CameraController } from '../../helpers/planetarium/core/CameraController';
import { EphemerisScheduler } from '../../helpers/planetarium/core/EphemerisScheduler';
import { buildScene, SceneRefs } from '../../helpers/planetarium/SceneBuilder';
import { shutdownScene } from '../../helpers/planetarium/SceneShutdown';
import { updateAtmosphere } from '../../helpers/planetarium/layers/AtmosphereLayer';
import { updateStarFovScale } from '../../helpers/planetarium/layers/StarsLayer';
import { updateCompassLabels } from '../../helpers/planetarium/layers/CompassLayer';
import { orientGroundToHorizon } from '../../helpers/planetarium/layers/GroundLayer';
import { orientAzGridToHorizon } from '../../helpers/planetarium/layers/GridLayer';
import { tickSelectionCirclePulse, positionSelectionCircleAtRaDec, positionSelectionCircle } from '../../helpers/planetarium/layers/SelectionCircle';
import { updateConstellationLabelSizes, updateStarLabelSizes } from '../../helpers/planetarium/layers/ConstellationsLayer';
import { raDecToVec3 } from '../../helpers/planetarium/utils/coordinates';
import { LAYER_NAMES } from '../../helpers/planetarium/utils/renderOrders';
import {
  PlanetariumLoadingEvent,
  PlanetariumLoadingStatus,
} from '../../helpers/planetarium/utils/loadingReporter';
import { onPanStart, onPanChange, onPanEnd } from '../../helpers/planetarium/gestures/PanHandler';
import { onPinchDown, onPinchMove } from '../../helpers/planetarium/gestures/PinchHandler';
import { onTap } from '../../helpers/planetarium/gestures/TapHandler';

import PlanetariumUI from '../../components/skymap/PlanetariumUI';
import { planetariumStyles } from '../../styles/screens/skymap/planetarium';

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanetariumSelectableObject = Star | GlobalPlanet | DSO | {
  family: 'Sun' | 'Moon';
  name: string;
  ra: number;
  dec: number;
  icon: any;
  phase?: string;
  v_mag?: number;
};

type PlanetariumLoadingStepState = {
  title: string;
  detail: string;
  status: PlanetariumLoadingStatus;
};

// ─── Loading step definitions ─────────────────────────────────────────────────

const LOADING_STEPS = [
  { id: 'scene',          title: 'Scene bootstrap',        pendingDetail: 'Waiting for the GL context' },
  { id: 'background',     title: 'Background dome',        pendingDetail: 'Milky Way texture not started yet' },
  { id: 'ground',         title: 'Horizon mask',           pendingDetail: 'Ground dome not started yet' },
  { id: 'atmosphere',     title: 'Atmosphere shader',      pendingDetail: 'Atmosphere setup not started yet' },
  { id: 'constellations', title: 'Constellation overlays', pendingDetail: 'Constellation overlays not started yet' },
  { id: 'compass',        title: 'Compass labels',         pendingDetail: 'Compass labels not started yet' },
  { id: 'stars',          title: 'Star field',             pendingDetail: 'Star catalog not started yet' },
  { id: 'planets',        title: 'Planets',                pendingDetail: 'Planet meshes not started yet' },
  { id: 'moon',           title: 'Moon',                   pendingDetail: 'Moon mesh not started yet' },
  { id: 'sun',            title: 'Sun',                    pendingDetail: 'Sun mesh not started yet' },
  { id: 'dso',            title: 'Deep-sky objects',       pendingDetail: 'DSO meshes not started yet' },
  { id: 'grids',          title: 'Coordinate grids',       pendingDetail: 'Sky grids not started yet' },
  { id: 'finalize',       title: 'Final assembly',         pendingDetail: 'Scene graph not assembled yet' },
] as const;

const createInitialStepsState = (): Record<string, PlanetariumLoadingStepState> =>
  LOADING_STEPS.reduce((acc, step) => {
    acc[step.id] = { title: step.title, detail: step.pendingDetail, status: 'pending' };
    return acc;
  }, {} as Record<string, PlanetariumLoadingStepState>);

function badgeKey(status: PlanetariumLoadingStatus): string {
  switch (status) {
    case 'done':    return 'DONE';
    case 'active':  return 'LIVE';
    case 'error':   return 'ERROR';
    default:        return 'WAIT';
  }
}

function translatedStep(stepId: string, status: PlanetariumLoadingStatus, field: 'title' | 'detail', fallback: string): string {
  return i18n.t(`skymap.planetarium.loading.steps.${stepId}.${badgeKey(status)}.${field}`, { defaultValue: fallback });
}

// ─── Sun helper ──────────────────────────────────────────────────────────────

function buildSunComputedInfos(sunData: ComputedSunInfos): ComputedObjectInfos {
  const badge = {
    label: i18n.t('common.visibility.visible'),
    icon: require('../../../assets/icons/FiEye.png'),
    backgroundColor: app_colors.green_eighty,
    foregroundColor: app_colors.white,
  };
  return {
    base: {
      family: 'Planet', type: 'Sun', rawType: 'Sun',
      name: sunData.base.name, otherName: undefined,
      constellation: sunData.base.constellation, icon: sunData.base.icon,
      ra: sunData.base.ra, dec: sunData.base.dec,
      degRa: sunData.base.ra, degDec: sunData.base.dec,
      v_mag: -26, b_mag: undefined, j_mag: undefined, k_mag: undefined, h_mag: undefined,
      alt: `${sunData.base.alt.toFixed(2)}°`, az: `${Math.round(sunData.base.az)}°`,
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
      nakedEye: badge, binoculars: badge, telescope: badge,
      visibilityGraph: sunData.visibility.visibilityGraph,
    },
    dsoAdditionalInfos: undefined,
    planetAdditionalInfos: undefined,
    error: '',
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_LOADING_MS   = 1400;
const SUCCESS_HOLD_MS  = 700;
const EPHEMERIS_THROTTLE_S = 5; // kept for EphemerisScheduler compat
const EPHEMERIS_RAF_MS = 50;    // max 20fps for scene updates in RAF loop

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Returns the ideal camera vertical FOV (degrees) so the object fills ~60% of
// screen width. Portrait aspect ≈ 9/16 → hFOV ≈ vFOV * 0.56, so:
//   targetVFOV = (angularSizeDeg / 0.6) / 0.56 ≈ angularSizeDeg * 2.98
// Point sources (stars, planets) clamp to a comfortable close-up FOV.
// Find the Three.js mesh in dsoGroup whose userData.index matches the selected DSO.
// Used to position the selection circle at the billboard's actual corners.
function findDsoMeshInScene(dsoGroup: THREE.Group, obj: any): THREE.Mesh | null {
  const digits = (v: any): string => String(v ?? '').replace(/\D/g, '');
  const mNum   = digits((obj as DSO).m);
  const ngcNum = digits((obj as DSO).ngc);
  const icNum  = digits((obj as DSO).ic);
  const name   = String((obj as DSO).name ?? '').toLowerCase().replace(/\s+/g, '');

  for (const child of dsoGroup.children) {
    const key = String(child.userData?.index ?? '').toLowerCase();
    const parsed = key.match(/^(ic|m|n)(\d+)/);
    const prefix = parsed?.[1];
    const num    = parsed?.[2] ?? '';
    if (prefix === 'm'  && mNum   && num === mNum)   return child as THREE.Mesh;
    if (prefix === 'n'  && ngcNum && num === ngcNum)  return child as THREE.Mesh;
    if (prefix === 'ic' && icNum  && num === icNum)   return child as THREE.Mesh;
    if (key === name) return child as THREE.Mesh;
  }
  return null;
}

function getIdealFov(object: any): number {
  if (!object) return 20;
  if ('family' in object && (object.family === 'Sun' || object.family === 'Moon')) return 4;

  const family = getObjectFamily(object);
  if (family === 'Star')   return 15;
  if (family === 'Planet') return 20;

  if (family === 'DSO') {
    const sizeStr: string = (object as DSO).apparent_size ?? '';
    const match = sizeStr.match(/[\d.]+/);
    if (match) {
      const angDeg = parseFloat(match[0]) / 60; // arcmin → degrees
      const targetFov = angDeg * 2.98;
      return Math.max(0.5, Math.min(45, targetFov));
    }
    return 15;
  }

  return 20;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Planetarium({ route, navigation }: any) {
  const { currentLocale } = useTranslation();
  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const { planets, moonCoords } = useSolarSystem();
  const { dsoCatalog } = useDsoCatalog();

  // ─── Three.js refs ───────────────────────────────────────────────────────────
  const sceneRefsRef     = useRef<SceneRefs | null>(null);
  const controllerRef    = useRef<CameraController | null>(null);
  const schedulerRef     = useRef(new EphemerisScheduler());
  const rafRef           = useRef<number | null>(null);
  const dsoCatalogRef    = useRef<DSO[]>([]);
  const atmosphereOnRef  = useRef<boolean>(true);
  const prevTranslation  = useRef({ x: 0, y: 0 });
  const glViewWidthRef   = useRef<number>(0);
  const glViewHeightRef  = useRef<number>(0);
  const zenithVecRef     = useRef<THREE.Vector3 | null>(null);
  const groundVisibleRef = useRef<boolean>(true);
  const lastEphemerisDateRef = useRef<Date>(dayjs().toDate());
  const followSelectionRef = useRef<boolean>(false);
  const precomputeDoneRef = useRef<boolean>(false);
  const computedInfosRef = useRef<ComputedObjectInfos | null>(null);
  const zoomLockRef = useRef<{ ra: number; dec: number } | null>(null);
  const currentUserLocationRef = useRef(currentUserLocation);
  const moonCoordsRef = useRef(moonCoords);
  const lastEphemerisRafMs = useRef(0);
  // Focused-constellation mode: auto-shows the pointed constellation name,
  // asterism lines, and boundary when the regular constellation overlays are off.
  const focusedConstellationOnRef = useRef<boolean>(true);
  const [focusedConstellationOn, setFocusedConstellationOn] = useState(true);

  // ─── Loading state ───────────────────────────────────────────────────────────
  const [loading, setLoading]             = useState(true);
  const [loadingError, setLoadingError]   = useState<string | null>(null);
  const [stepsState, setStepsState]       = useState<Record<string, PlanetariumLoadingStepState>>(createInitialStepsState);
  const activeStepRef                     = useRef<string>(LOADING_STEPS[0].id);

  const handleLoadingEvent = useCallback((event: PlanetariumLoadingEvent) => {
    if (event.status === 'active' || event.status === 'error') {
      activeStepRef.current = event.stepId;
    }
    setStepsState((prev) => ({
      ...prev,
      [event.stepId]: { title: event.title, detail: event.detail, status: event.status },
    }));
  }, []);

  // ─── Selection ───────────────────────────────────────────────────────────────
  const [selectedObject, setSelectedObject]     = useState<PlanetariumSelectableObject | null>(null);
  const [computedInfos, setComputedInfos]       = useState<ComputedObjectInfos | null>(null);
  const [followSelection, setFollowSelection]   = useState(false);
  const initialSelectionDone                    = useRef(false);
  const pendingFocusRef                         = useRef(false);

  useEffect(() => { followSelectionRef.current = followSelection; }, [followSelection]);
  useEffect(() => { computedInfosRef.current = computedInfos; }, [computedInfos]);
  useEffect(() => { currentUserLocationRef.current = currentUserLocation; }, [currentUserLocation]);
  useEffect(() => { moonCoordsRef.current = moonCoords; }, [moonCoords]);

  // ─── Timeline ────────────────────────────────────────────────────────────────
  const [referenceDate, setReferenceDate]   = useState<Dayjs>(dayjs());
  const [timelinePlaying, setTimelinePlaying] = useState(true);
  const [planetariumFov, setPlanetariumFov] = useState(75);
  // Stable ref so the RAF loop can call the latest setState without stale closure
  const fovNotifyRef = useRef<(f: number) => void>(() => {});
  fovNotifyRef.current = setPlanetariumFov;
  const lastNotifiedFovRef = useRef(75);
  const referenceDateRef       = useRef<Dayjs>(referenceDate);
  // Used to debounce React-state writes from rapid chevron taps to at most
  // one per animation frame, preventing "Maximum update depth exceeded".
  const pendingDateUpdateRef   = useRef<number | null>(null);

  // ── Real-time anchor ─────────────────────────────────────────────────────────
  // Instead of a setInterval that advances time 1s/s, the RAF loop computes
  // rafDate = anchor.simDate + (performance.now() - anchor.wallMs) every frame.
  // This gives sub-millisecond time accuracy at 60fps with zero stutter.
  // The anchor is reset whenever the user seeks, adjusts, or resumes playback.
  const playAnchorRef = useRef<{ wallMs: number; simDate: Dayjs }>({
    wallMs: performance.now(),
    simDate: dayjs(),
  });
  const timelinePlayingRef = useRef<boolean>(true);
  // Seek lock: set to true while the slider is being dragged so the 1fps UI
  // interval cannot update timelineDate and trigger the sliderRatio effect,
  // which would snap the thumb away from the user's finger.
  const isSeekingRef   = useRef<boolean>(false);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep referenceDateRef in sync with explicit React state writes
  // (seek, adjust, reset). In play mode the RAF loop overwrites it every frame
  // via the anchor, so the effect runs at most once (on mount / explicit sets).
  useEffect(() => {
    referenceDateRef.current = referenceDate;
  }, [referenceDate]);

  useEffect(() => {
    dsoCatalogRef.current = dsoCatalog;
  }, [dsoCatalog]);

  // ─── Timeline play/pause ─────────────────────────────────────────────────────

  useEffect(() => {
    timelinePlayingRef.current = timelinePlaying;
    if (timelinePlaying) {
      // Re-anchor from the current frozen position so the RAF resumes without jump.
      playAnchorRef.current = { wallMs: performance.now(), simDate: referenceDateRef.current };
    }
  }, [timelinePlaying]);

  // ─── UI clock update (1fps setInterval) ──────────────────────────────────────
  // The RAF loop does NOT call setReferenceDate — that would trigger the slider's
  // sliderRatio useEffect mid-drag and snap the thumb. Instead this interval fires
  // once per second, but is a no-op while the user is dragging (isSeekingRef).

  useEffect(() => {
    if (!timelinePlaying) return;
    const id = setInterval(() => {
      if (isSeekingRef.current) return;
      const now = playAnchorRef.current.simDate.add(
        performance.now() - playAnchorRef.current.wallMs,
        'millisecond',
      );
      setReferenceDate(now);
    }, 1000);
    return () => clearInterval(id);
  }, [timelinePlaying]);

  // ─── Status bar ──────────────────────────────────────────────────────────────

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => StatusBar.setHidden(false);
  }, []);

  // ─── Computed object infos ────────────────────────────────────────────────────
  // computeObject is expensive (864 horizon-crossing calculations). Run it only
  // when the selected object changes, not on every timeline tick (every second).
  // The timeline date is read from the ref so it doesn't re-trigger the effect.

  useEffect(() => {
    if (!selectedObject || !currentUserLocation) {
      setComputedInfos(null);
      return;
    }
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const safeDate = referenceDateRef.current.isValid() ? referenceDateRef.current : dayjs();

    // Helper: animate camera + set FOV + position selection circle.
    // Always called with fresh infos — no race condition.
    const applyFocus = (infos: ComputedObjectInfos) => {
      if (!controllerRef.current) return;
      const { degRa, degDec, family } = infos.base;
      if (typeof degRa !== 'number' || typeof degDec !== 'number') return;

      controllerRef.current.animateTo(degRa, degDec, 60);
      controllerRef.current.setFov(getIdealFov(selectedObject));

      const refs = sceneRefsRef.current;
      if (!refs) return;

      // For DSOs with a billboard, use actual corner positions for an exact fit
      if (family === 'DSO') {
        const mesh = findDsoMeshInScene(refs.dsoGroup, selectedObject);
        if (mesh) {
          positionSelectionCircle(refs.selectionCircle, mesh, refs.camera, 'dso');
          return;
        }
      }

      // Fallback: position from RA/Dec with size approximation
      let arcmin: number | undefined;
      if (family === 'DSO') {
        const m = String((selectedObject as any).apparent_size ?? '').match(/[\d.]+/);
        if (m) arcmin = parseFloat(m[0]);
      }
      positionSelectionCircleAtRaDec(refs.selectionCircle, degRa, degDec, refs.camera, family, arcmin);
    };

    if ('family' in selectedObject && (selectedObject as any).family === 'Sun') {
      const sunInfos = buildSunComputedInfos(getSunData(safeDate, observer));
      setComputedInfos(sunInfos);
      if (pendingFocusRef.current) { pendingFocusRef.current = false; applyFocus(sunInfos); }
      return;
    }

    // Phase 1: instant partial info (no horizon scan) — UI responds immediately
    const light = computeObject({ object: selectedObject as any, observer, lang: currentLocale, date: safeDate, light: true });
    setComputedInfos(light);

    // Apply focus with fresh data — no race condition with computedInfos state
    if (pendingFocusRef.current && light) { pendingFocusRef.current = false; applyFocus(light); }

    // Phase 2: full info deferred; cache makes it instant on repeat selection
    const timer = setTimeout(() => {
      const full = computeObject({ object: selectedObject as any, observer, lang: currentLocale, date: safeDate });
      setComputedInfos(full);
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedObject, currentLocale, currentUserLocation]);

  // ─── Initial selection (route param only) ────────────────────────────────────

  useEffect(() => {
    if (initialSelectionDone.current) return;
    if (!route?.params?.defaultObject) return;

    setSelectedObject(route.params.defaultObject);
    pendingFocusRef.current = true;
    initialSelectionDone.current = true;
  }, [route?.params?.defaultObject]);


  // ─── Follow mode ─────────────────────────────────────────────────────────────
  // Handled every frame in the RAF loop via followSelectionRef + computedInfosRef.
  // This effect only handles the non-time-driven case (follow toggled or object changed).

  useEffect(() => {
    if (!followSelection || !computedInfos || !controllerRef.current) return;
    const { degRa, degDec } = computedInfos.base;
    if (typeof degRa === 'number' && typeof degDec === 'number') {
      controllerRef.current.setLook(degRa, degDec);
    }
  }, [followSelection, computedInfos]);

  // ─── Scene ephemeris update ───────────────────────────────────────────────────
  // All time-driven updates are handled in the RAF loop via lastEphemerisRafMs.
  // This effect only forces an immediate re-update when location or loading changes.

  useEffect(() => {
    lastEphemerisRafMs.current = 0; // reset throttle → RAF will update on next frame
  }, [loading, currentUserLocation]);

  // ─── Background precompute: warm cache for Messier DSOs after scene loads ─────

  useEffect(() => {
    if (loading || !currentUserLocation || precomputeDoneRef.current) return;
    precomputeDoneRef.current = true;

    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const date = referenceDateRef.current.isValid() ? referenceDateRef.current : dayjs();

    const timer = setTimeout(() => {
      const messier = dsoCatalogRef.current.filter((dso: DSO) => dso.m && dso.m !== '');
      let batchStart = 0;
      const processBatch = () => {
        const end = Math.min(batchStart + 5, messier.length);
        for (let i = batchStart; i < end; i++) {
          computeObject({ object: messier[i], observer, lang: currentLocale, date });
        }
        batchStart += 5;
        if (batchStart < messier.length) setTimeout(processBatch, 100);
      };
      processBatch();
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, currentUserLocation]);

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (sceneRefsRef.current) {
        shutdownScene(sceneRefsRef.current.scene, sceneRefsRef.current.renderer as any);
      }
    };
  }, []);

  // ─── GL context init ──────────────────────────────────────────────────────────

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const startedAt = Date.now();
    setLoading(true);
    setLoadingError(null);
    setStepsState(createInitialStepsState());

    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const visibleStars = starsCatalog.filter((s: Star) => s.V < 6);

    try {
      const refs = await buildScene(
        gl,
        currentUserLocation,
        visibleStars,
        () => dsoCatalogRef.current,
        referenceDate,
        setSelectedObject as any,
        handleLoadingEvent,
      );

      sceneRefsRef.current  = refs;
      controllerRef.current = refs.controller;

      // NDC raycasting needs LOGICAL pixels (event.x is in logical coords),
      // but gl.drawingBufferWidth is in physical pixels.
      const pixelRatio = PixelRatio.get();
      glViewWidthRef.current  = refs.glViewWidth  / pixelRatio;
      glViewHeightRef.current = refs.glViewHeight / pixelRatio;

      zenithVecRef.current  = refs.zenithVec.clone();

      // Initialise the controller zenith so the horizon is flat from the first frame
      controllerRef.current.setZenith(refs.zenithVec);

      // Initial atmosphere update
      const sunData = getSunData(referenceDate, observer);
      updateAtmosphere(refs.atmosphere, sunData, true, refs.starsCloud, refs.scene.getObjectByName(LAYER_NAMES.background) as THREE.Mesh | null, refs.dsoGroup, refs.zenithVec);

      // Warm-up render pass: forces texture upload to the GPU while the loading
      // screen is still visible, so the first user-visible frame is already smooth.
      refs.renderer.render(refs.scene, refs.camera);
      gl.endFrameEXP();

      // Minimum loading delay
      const elapsed = Date.now() - startedAt;
      const holdMs = Math.max(0, MIN_LOADING_MS - elapsed) + SUCCESS_HOLD_MS;
      if (holdMs > 0) await new Promise((r) => setTimeout(r, holdMs));

      setLoading(false);

      // ─── RAF render loop ───────────────────────────────────────────────────────
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);

        const ctrl = controllerRef.current;
        if (!ctrl) return;

        const camera = refs.camera;
        const w = glViewWidthRef.current;

        const wasAnimating = ctrl.isAnimating;
        if (wasAnimating) ctrl.tickAnimation();
        if (!wasAnimating) ctrl.tickInertia(w);
        ctrl.tickFov();

        // Notify React of FOV changes every frame the value actually changes.
        // No time-throttle: the overlay must follow the pinch gesture at 60fps.
        // When FOV is stable (no pinch), this branch is never taken → zero cost.
        if (ctrl.fov !== lastNotifiedFovRef.current) {
          lastNotifiedFovRef.current = ctrl.fov;
          fovNotifyRef.current(ctrl.fov);
        }

        updateStarFovScale(refs.starsCloud, ctrl.fov);
        ctrl.applyToCamera(camera);

        tickSelectionCirclePulse(refs.selectionCircle);

        // ── Follow mode: lock camera on selected object every frame ─────────────
        if (followSelectionRef.current && computedInfosRef.current) {
          const { degRa, degDec } = computedInfosRef.current.base;
          if (typeof degRa === 'number' && typeof degDec === 'number') {
            ctrl.setLook(degRa, degDec);
          }
        }

        // ── Real-time sim clock: computed every frame from wall-clock anchor ─────
        // In play mode: rafDate advances continuously at 1:1 real time (no stutter).
        // In pause mode: rafDate is frozen at referenceDateRef (last explicit set).
        const rafNow = performance.now();
        const rafDate = timelinePlayingRef.current
          ? playAnchorRef.current.simDate.add(rafNow - playAnchorRef.current.wallMs, 'millisecond')
          : referenceDateRef.current;
        const rafDateObj = rafDate.toDate();

        // Keep ref in sync every frame so seek/adjust always read current sim time.
        // React state (timelineDate prop) is updated by the 1fps interval instead —
        // never from here — to avoid triggering the slider's sliderRatio effect
        // while the user is dragging.
        referenceDateRef.current = rafDate;

        const rafLoc = currentUserLocationRef.current;
        const rafObs = rafLoc ? { latitude: rafLoc.lat, longitude: rafLoc.lon } : null;

        // ── Sidereal drift compensation: every frame (two cheap trig calls) ──────
        // Converts the current look direction to alt/az at the previous frame's
        // time, then back to RA/Dec at the current time — keeping the camera
        // locked to the same sky patch as Earth rotates. Running this at 60fps
        // (vs the old 20fps) eliminates the 0.75" per-step jitter.
        if (rafObs && !followSelectionRef.current) {
          const horiz = convertEquatorialToHorizontal(lastEphemerisDateRef.current, rafObs, {
            ra: ctrl.lookRa, dec: ctrl.lookDec,
          });
          const corrected = convertHorizontalToEquatorial(rafDateObj, rafObs, {
            alt: horiz.alt, az: horiz.az,
          });
          if (isFinite(corrected.ra) && isFinite(corrected.dec)) {
            ctrl.setLook(corrected.ra, corrected.dec);
          }
        }
        lastEphemerisDateRef.current = rafDateObj;

        // ── Heavy ephemeris: planet positions, atmosphere, grids — capped at 20fps
        if (rafObs && rafNow - lastEphemerisRafMs.current >= EPHEMERIS_RAF_MS) {
          lastEphemerisRafMs.current = rafNow;

          const snapshot = refs.solarSystemLayer.update(rafDate, rafObs, (moonCoordsRef.current as any)?.currentIconUrl);
          updateAtmosphere(
            refs.atmosphere, snapshot.sunData, atmosphereOnRef.current,
            refs.starsCloud, refs.scene.getObjectByName(LAYER_NAMES.background) as THREE.Mesh | null,
            refs.dsoGroup,
            zenithVecRef.current,
          );

          const zenithEq = convertHorizontalToEquatorial(rafDateObj, rafObs, { alt: 90, az: 0 });
          zenithVecRef.current = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();
          refs.zenithVec.copy(zenithVecRef.current);
          ctrl.setZenith(zenithVecRef.current);

          orientGroundToHorizon(refs.ground, rafLoc!, rafDateObj);
          orientAzGridToHorizon(refs.azGrid, rafLoc!, rafDateObj);
          updateCompassLabels(refs.compassLabels, rafLoc!, rafDateObj, 0.98);
        }

        updateConstellationLabelSizes(
          refs.constellationLabels,
          camera,
          zenithVecRef.current,
          groundVisibleRef.current,
        );

        updateStarLabelSizes(
          refs.starLabels,
          camera,
          zenithVecRef.current,
          groundVisibleRef.current,
        );

        refs.solarSystemLayer.updateLabels(
          camera,
          zenithVecRef.current,
          groundVisibleRef.current,
        );

        // Focused-constellation mode: active only when the user has enabled it
        // AND the regular constellation overlays (lines + labels) are both off.
        const inFocusMode =
          focusedConstellationOnRef.current &&
          !refs.constellationLines.visible && !refs.constellationLabels.visible;
        refs.focusedConstellationLayer.group.visible = inFocusMode;
        if (inFocusMode) {
          refs.focusedConstellationLayer.tick(ctrl.lookRa, ctrl.lookDec, camera);
        }

        refs.renderer.render(refs.scene, camera);
        gl.endFrameEXP();
      };

      loop();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const failId = activeStepRef.current || LOADING_STEPS[0].id;
      const step = LOADING_STEPS.find((s) => s.id === failId);
      handleLoadingEvent({ stepId: failId, title: step?.title ?? 'Loading', detail: msg, status: 'error' });
      setLoadingError(msg);
      console.error('[Planetarium] Failed to build scene', err);
    }
  };

  // ─── Seek callback (used by slider — fires on every drag move) ───────────────
  // Re-anchors the wall-clock anchor so the RAF shows the seeked time instantly.
  // Also raises isSeekingRef so the 1fps interval cannot overwrite timelineDate
  // while the thumb is moving; the lock self-releases 400ms after the last move.

  const onSeekTimeline = useCallback((date: Dayjs) => {
    referenceDateRef.current = date;
    playAnchorRef.current = { wallMs: performance.now(), simDate: date };

    isSeekingRef.current = true;
    if (seekTimeoutRef.current !== null) clearTimeout(seekTimeoutRef.current);
    seekTimeoutRef.current = setTimeout(() => {
      isSeekingRef.current = false;
      seekTimeoutRef.current = null;
    }, 400);
  }, []);

  // ─── Chevron-button adjustment ────────────────────────────────────────────────
  // Reads the current sim time from the anchor (not the 1fps-stale ref) so the
  // adjustment is applied to the precise current moment, then re-anchors.

  const onAdjustTimeline = useCallback(
    (unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year', delta: number) => {
      const currentSim = timelinePlayingRef.current
        ? playAnchorRef.current.simDate.add(performance.now() - playAnchorRef.current.wallMs, 'millisecond')
        : referenceDateRef.current;
      const newDate = currentSim.add(delta, unit);
      referenceDateRef.current = newDate;
      playAnchorRef.current = { wallMs: performance.now(), simDate: newDate };

      if (pendingDateUpdateRef.current !== null) {
        cancelAnimationFrame(pendingDateUpdateRef.current);
      }
      pendingDateUpdateRef.current = requestAnimationFrame(() => {
        setReferenceDate(newDate);
        pendingDateUpdateRef.current = null;
      });
    },
    [],
  );

  // ─── Layer toggles ────────────────────────────────────────────────────────────

  const toggleLayer = useCallback((name: string) => {
    const refs = sceneRefsRef.current;
    if (!refs) return;
    const obj = refs.scene.getObjectByName(name);
    if (obj) obj.visible = !obj.visible;
  }, []);

  const toggleGround = useCallback(() => {
    const refs = sceneRefsRef.current;
    if (!refs) return;
    refs.ground.visible = !refs.ground.visible;
    groundVisibleRef.current = refs.ground.visible;
  }, []);

  const toggleAtmosphere = useCallback(() => {
    const refs = sceneRefsRef.current;
    if (!refs) return;
    atmosphereOnRef.current = !atmosphereOnRef.current;
    refs.atmosphere.visible = atmosphereOnRef.current;
    const sunData = getSunData(referenceDateRef.current, {
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lon,
    });
    updateAtmosphere(
      refs.atmosphere,
      sunData,
      atmosphereOnRef.current,
      refs.starsCloud,
      refs.scene.getObjectByName(LAYER_NAMES.background) as THREE.Mesh | null,
      refs.dsoGroup,
      zenithVecRef.current,
    );
  }, [currentUserLocation]);

  const toggleStarLabels = useCallback(() => toggleLayer(LAYER_NAMES.starLabels), [toggleLayer]);
  const toggleSolarSystemLabels = useCallback(() => toggleLayer(LAYER_NAMES.solarSystemLabels), [toggleLayer]);

  const toggleFocusedConstellation = useCallback(() => {
    const next = !focusedConstellationOnRef.current;
    focusedConstellationOnRef.current = next;
    setFocusedConstellationOn(next);
    // When disabled, immediately hide the layer and reset its state so the
    // last-displayed constellation doesn't linger until the next tick.
    if (!next) {
      const refs = sceneRefsRef.current;
      if (refs) {
        refs.focusedConstellationLayer.group.visible = false;
        refs.focusedConstellationLayer.reset();
      }
    }
  }, []);

  const handleCenterObject = useCallback(() => {
    if (!computedInfos || !controllerRef.current) return;
    const { degRa, degDec } = computedInfos.base;
    if (typeof degRa === 'number' && typeof degDec === 'number') {
      controllerRef.current.animateTo(degRa, degDec, 60);
    }
  }, [computedInfos]);

  // ─── Gestures ────────────────────────────────────────────────────────────────

  const panGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      setFollowSelection(false);
      if (controllerRef.current) onPanStart(e, controllerRef.current);
      prevTranslation.current = { x: 0, y: 0 };
    })
    .onChange((e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
      if (controllerRef.current) {
        onPanChange(e, controllerRef.current, glViewWidthRef.current, prevTranslation.current);
      }
    })
    .onEnd((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (controllerRef.current) onPanEnd(e, controllerRef.current);
    });

  const pinchGesture = Gesture.Pinch()
    .onTouchesDown((e: GestureTouchEvent) => {
      setFollowSelection(false);
      const infos = computedInfosRef.current;
      if (followSelectionRef.current && infos) {
        const { degRa, degDec } = infos.base;
        if (typeof degRa === 'number' && typeof degDec === 'number') {
          zoomLockRef.current = { ra: degRa, dec: degDec };
        }
      }
      if (controllerRef.current) onPinchDown(e, controllerRef.current);
    })
    .onTouchesMove((e: GestureTouchEvent) => {
      if (controllerRef.current) {
        onPinchMove(e, controllerRef.current);
        if (zoomLockRef.current) {
          controllerRef.current.setLook(zoomLockRef.current.ra, zoomLockRef.current.dec);
        }
      }
    })
    .onTouchesUp(() => {
      zoomLockRef.current = null;
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd((e) => {
      const refs = sceneRefsRef.current;
      if (!refs || !controllerRef.current) return;
      onTap(
        e,
        glViewWidthRef.current,
        glViewHeightRef.current,
        refs.scene,
        refs.camera,
        refs.selectionCircle,
        zenithVecRef.current,
        groundVisibleRef.current,
        setSelectedObject as any,
        controllerRef.current?.fov,
      );
    });

  const composedGestures = Gesture.Race(
    Gesture.Simultaneous(panGesture, pinchGesture),
    Gesture.Exclusive(tapGesture),
  );

  // ─── Loading screen helpers ───────────────────────────────────────────────────

  const loadingSteps = LOADING_STEPS.map((s) => ({ id: s.id, ...stepsState[s.id] }));
  const completedCount = loadingSteps.filter((s) => s.status === 'done').length;
  const progress = loadingSteps.length === 0 ? 0 : completedCount / loadingSteps.length;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <GestureHandlerRootView>
      {!loading && (
        <PlanetariumUI
          navigation={navigation}
          infos={computedInfos}
          onSelectObject={(obj) => {
            setSelectedObject(obj as PlanetariumSelectableObject);
          }}
          onSelectFromSearch={(obj) => {
            setSelectedObject(obj as PlanetariumSelectableObject);
            pendingFocusRef.current = true;
            setFollowSelection(true);
          }}
          onShowEqGrid={()              => toggleLayer(LAYER_NAMES.eqGrid)}
          onShowConstellations={()      => toggleLayer(LAYER_NAMES.constellations)}
          onShowConstellationLabels={()  => toggleLayer(LAYER_NAMES.constellationLabels)}
          onShowAzGrid={()              => toggleLayer(LAYER_NAMES.azGrid)}
          onShowGround={toggleGround}
          onShowPlanets={()             => toggleLayer(LAYER_NAMES.planets)}
          onShowDSO={()                 => toggleLayer(LAYER_NAMES.dso)}
          onShowCompassLabels={()       => toggleLayer(LAYER_NAMES.compassLabels)}
          onShowAtmosphere={toggleAtmosphere}
          onShowStarLabels={toggleStarLabels}
          onShowSolarSystemLabels={toggleSolarSystemLabels}
          onToggleFocusedConstellation={toggleFocusedConstellation}
          isFocusedConstellationOn={focusedConstellationOn}
          onCenterObject={handleCenterObject}
          cameraFovDeg={planetariumFov}
          isFollowing={followSelection}
          onToggleFollow={() => setFollowSelection((v) => !v)}
          timelineDate={referenceDate}
          isTimelinePlaying={timelinePlaying}
          onToggleTimelinePlay={() => {
            setTimelinePlaying((v) => {
              const next = !v;
              timelinePlayingRef.current = next;
              if (next) {
                // Resuming: anchor from the current frozen position
                playAnchorRef.current = { wallMs: performance.now(), simDate: referenceDateRef.current };
              }
              return next;
            });
          }}
          onSeekTimeline={onSeekTimeline}
          onAdjustTimeline={onAdjustTimeline}
          onChangeTimelineDate={(date: Dayjs) => {
            referenceDateRef.current = date;
            playAnchorRef.current = { wallMs: performance.now(), simDate: date };
            setReferenceDate(date);
          }}
          onResetTimelineDate={() => {
            const now = dayjs();
            referenceDateRef.current = now;
            playAnchorRef.current = { wallMs: performance.now(), simDate: now };
            timelinePlayingRef.current = true;
            setTimelinePlaying(true);
            setReferenceDate(now);
          }}
        />
      )}

      <View style={planetariumStyles.container}>
        <GestureDetector gesture={composedGestures}>
          <View style={{ flex: 1 }}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          </View>
        </GestureDetector>

        {loading && (
          <View style={planetariumStyles.loadingScreen}>
            <View style={planetariumStyles.loadingPanel}>
              <ActivityIndicator size="large" color={app_colors.white} />
              <Text style={planetariumStyles.loadingTitle}>
                {i18n.t('skymap.planetarium.loading.title')}
              </Text>
              <Text
                style={[
                  planetariumStyles.loadingSubtitle,
                  loadingError ? planetariumStyles.loadingErrorText : null,
                ]}
              >
                {loadingError
                  ? i18n.t('skymap.planetarium.loading.failedTitle')
                  : i18n.t('skymap.planetarium.loading.subtitle')}
              </Text>
              <Text style={[planetariumStyles.loadingProgressMeta, { marginTop: 10 }]}>
                {i18n.t('skymap.planetarium.loading.progressMeta', { progress: Math.round(progress * 100) })}
              </Text>
              <Text style={[planetariumStyles.loadingProgressMeta, { marginBottom: 10 }]}>
                {i18n.t('skymap.planetarium.loading.completedSteps', { completed: completedCount, total: loadingSteps.length })}
              </Text>
              <View style={planetariumStyles.loadingProgressTrack}>
                <View
                  style={[
                    planetariumStyles.loadingProgressFill,
                    {
                      width: `${Math.max(8, Math.round(progress * 100))}%`,
                      backgroundColor: loadingError ? app_colors.red : app_colors.green_eighty,
                    },
                  ]}
                />
              </View>
              <Text style={planetariumStyles.loadingSectionTitle}>
                {i18n.t('skymap.planetarium.loading.detailedSteps')}
              </Text>
              <ScrollView
                style={planetariumStyles.loadingContent}
                contentContainerStyle={planetariumStyles.loadingContentInner}
                showsVerticalScrollIndicator
              >
                {loadingSteps.map((step, index) => (
                  <View
                    key={step.id}
                    style={[
                      planetariumStyles.loadingStepRow,
                      index === 0 ? planetariumStyles.loadingStepRowFirst : null,
                      step.status === 'active' ? planetariumStyles.loadingStepRowActive : null,
                      step.status === 'done'   ? planetariumStyles.loadingStepRowDone   : null,
                      step.status === 'error'  ? planetariumStyles.loadingStepRowError  : null,
                    ]}
                  >
                    <View style={planetariumStyles.loadingStepHeader}>
                      <Text style={planetariumStyles.loadingStepTitle}>
                        {translatedStep(step.id, step.status, 'title', step.title)}
                      </Text>
                      <View
                        style={[
                          planetariumStyles.loadingBadge,
                          step.status === 'active' ? planetariumStyles.loadingBadgeActive : null,
                          step.status === 'done'   ? planetariumStyles.loadingBadgeDone   : null,
                          step.status === 'error'  ? planetariumStyles.loadingBadgeError  : null,
                        ]}
                      >
                        <Text style={planetariumStyles.loadingBadgeText}>
                          {i18n.t(`skymap.planetarium.loading.badges.${badgeKey(step.status)}`, { defaultValue: badgeKey(step.status) })}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        planetariumStyles.loadingStepDetail,
                        step.status === 'error' ? planetariumStyles.loadingErrorText : null,
                      ]}
                    >
                      {step.status === 'error' && loadingError
                        ? loadingError
                        : translatedStep(step.id, step.status, 'detail', step.detail)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
