import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, PixelRatio, StatusBar, View } from "react-native";
import * as THREE from "three";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { ChevronLeft, Clock, Layers, Search, Telescope } from "lucide-react-native";
import {
  convertEquatorialToHorizontal,
  convertHorizontalToEquatorial,
  getSolarEquatorialCoordinate,
  type GeographicCoordinate,
} from "@observerly/astrometry";
import { useLocation } from "../../context/LocationContext";
import { useAppUnits } from "../../hooks/useAppUnits";
import { app_colors } from "../../helpers/variables";
import { getObjectById } from "../../helpers/api/catalog/objects";
import type { CatalogObjectDetail } from "../../types/catalog/CatalogObject";
import { buildScene, type SceneRefs } from "../../helpers/planetarium/SceneBuilder";
import { shutdownScene } from "../../helpers/planetarium/SceneShutdown";
import { updateStarFovScale } from "../../helpers/planetarium/layers/StarsLayer";
import { updateDsoFovScale } from "../../helpers/planetarium/layers/DsoLayer";
import { orientGroundToHorizon } from "../../helpers/planetarium/layers/GroundLayer";
import { updateAtmosphere } from "../../helpers/planetarium/layers/AtmosphereLayer";
import { orientAzGridToHorizon } from "../../helpers/planetarium/layers/GridLayer";
import {
  computeSolarSystemSnapshot,
  getSolarSystemBodyIdForCatalogId,
  getSolarSystemBodyLabel,
  SOLAR_SYSTEM_BODY_IDS,
  SOLAR_SYSTEM_CATALOG_ID,
  updateSolarSystemFovScale,
  updateSolarSystemLayer,
  type SolarSystemSnapshot,
} from "../../helpers/planetarium/layers/SolarSystemLayer";
import { raDecToVec3 } from "../../helpers/planetarium/utils/coordinates";
import { projectRaDecToScreen } from "../../helpers/planetarium/utils/screenProjection";
import { getGridEdgeLabels } from "../../helpers/planetarium/utils/gridEdgeLabels";
import { onPanChange, onPanEnd, onPanStart } from "../../helpers/planetarium/gestures/PanHandler";
import { onPinchDown, onPinchMove } from "../../helpers/planetarium/gestures/PinchHandler";
import { pickObjectAtScreenPoint, type PickedObject } from "../../helpers/planetarium/selection/ObjectPicker";
import { getComboFieldOfView } from "../../helpers/fieldSimulator/fieldOfView";
import type { FieldSimulatorCombo } from "../../helpers/fieldSimulator/setupCombos";
import type { CatalogObjectSummary } from "../../types/catalog/CatalogObject";
import PlanetariumLabelsOverlay, { type PlanetariumOverlayLabel } from "./components/PlanetariumLabelsOverlay";
import SelectionMarker, { type SelectionMarkerPoint } from "./components/SelectionMarker";
import ObjectSelectionSheet from "./components/ObjectSelectionSheet";
import ExploreSearchModal from "./components/ExploreSearchModal";
import LayerSettingsPanel from "./components/LayerSettingsPanel";
import FieldSimulatorPicker from "./components/FieldSimulatorPicker";
import FieldOfViewOverlay from "./components/FieldOfViewOverlay";
import PlanetariumIconButton from "./components/PlanetariumIconButton";
import TimeControlPanel from "./components/TimeControlPanel";
import { DEFAULT_LAYER_VISIBILITY, type LayerVisibility } from "./ExploreScreen.layers";
import { exploreScreenStyles as styles } from "./ExploreScreen.styles";

// Recalcule les éphémérides (Soleil/Lune/planètes, orientation du sol/horizon/grille azimutale,
// étiquettes) à ce rythme plutôt qu'à chaque frame (60 fps, boucle de rendu) : l'écart est
// imperceptible sur quelques dizaines de millisecondes, et ça évite de refaire ces calculs
// trigonométriques 60 fois par seconde pour rien — même principe que `main` (`EPHEMERIS_RAF_MS`).
const EPHEMERIS_INTERVAL_MS = 50;

const CARDINAL_AZIMUTHS = [0, 90, 180, 270] as const;
const CARDINAL_LETTERS = ["N", "E", "S", "O"] as const;

const isSamePickedObject = (a: PickedObject, b: PickedObject): boolean =>
  a.kind === "solar_system" && b.kind === "solar_system"
    ? a.bodyId === b.bodyId
    : a.kind !== "solar_system" && b.kind !== "solar_system" && a.object.id === b.object.id;

// En-deçà de cet écart (degrés/FOV), on considère que la caméra n'a pas bougé — évite de redéclencher
// `setLabels` (donc un rendu React de ~90 <Text>) à cause du seul bruit de calcul flottant (le
// recalage sidéral fait un aller-retour RA/Dec→Alt/Az→RA/Dec à chaque frame même immobile).
const LABEL_CAMERA_EPSILON = 1e-5;

/**
 * Planétarium 3D (onglet "Explorer") — les 7 phases du plan : moteur de scène (expo-gl/expo-three/
 * three, UN SEUL contexte GL partagé) + sol/horizon + atmosphère + étoiles (phase 1) ;
 * constellations + grilles + boussole (phase 2) ; Soleil/Lune/planètes + horloge de simulation
 * (phase 3) ; DSO en points colorés par catégorie (phase 4) ; sélection par tap + vol de caméra +
 * fiche de détail (phase 5) ; recherche d'objet (phase 6) ; bascules de couches (phase 7). Reste
 * hors scope (voir le plan) : rendu texturé réaliste des planètes, conditionné à la fourniture des
 * textures par l'utilisateur.
 */
export const ExploreScreen = () => {
  const { location } = useLocation();
  const { formatDate } = useAppUnits();
  const { t } = useTranslation("explore");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sceneRef = useRef<SceneRefs | null>(null);
  // `t` est capturé par la boucle RAF (créée une seule fois, voir onContextCreate) : sans ce ref, un
  // changement de langue pendant que l'écran reste ouvert laisserait les étiquettes du système
  // solaire figées sur la langue active au moment du montage.
  const tRef = useRef(t);
  tRef.current = t;
  const rafRef = useRef<number | null>(null);
  const prevTranslationRef = useRef({ x: 0, y: 0 });
  const lastEphemerisFrameMsRef = useRef(0);
  const lastEphemerisDateRef = useRef(new Date());
  const observerRef = useRef<GeographicCoordinate | null>(null);
  // Sources des étiquettes, recalculées au rythme throttlé de l'éphéméride (voir plus bas) mais
  // reprojetées à l'écran à CHAQUE frame (voir boucle RAF) — sinon les étiquettes accusent un
  // décalage visible (jusqu'à l'intervalle d'éphéméride) derrière la scène 3D pendant un pan rapide.
  const compassEquatorialRef = useRef<{ ra: number; dec: number }[]>([]);
  const solarSystemSnapshotRef = useRef<SolarSystemSnapshot>({});
  // Initialisé à une valeur impossible à atteindre (pas NaN : `Math.abs(x - NaN)` vaut NaN, et
  // `NaN > epsilon` est TOUJOURS faux — la comparaison ne "rattrape" jamais une vraie valeur, donc
  // `cameraMoved` ne devient jamais vrai et les étiquettes ne s'affichent jamais). `Infinity` force
  // bien le premier calcul.
  const lastLabelCameraRef = useRef({ ra: Infinity, dec: Infinity, fov: Infinity });
  // Largeur LOGIQUE (points, pas pixels physiques) de la GLView : la sensibilité du pan et le futur
  // raycast de sélection (phase 5) en ont besoin — `gl.drawingBufferWidth` est en pixels physiques
  // (= logique × PixelRatio), les évènements de geste (translationX...) sont en points logiques.
  const glViewWidthLogicalRef = useRef(1);

  // ─── Horloge de simulation ────────────────────────────────────────────────
  // Ancre horloge murale/temps simulé (comme `main`) : en lecture, le temps simulé avance à partir
  // de cette ancre plutôt que d'être recalculé frame par frame à partir de `new Date()` à chaque
  // fois — évite toute dérive/saccade. En pause, `simDateRef` est figée au dernier instant choisi.
  const isPlayingRef = useRef(true);
  const playAnchorRef = useRef({ wallMs: performance.now(), simDate: new Date() });
  const simDateRef = useRef(new Date());
  const [isPlaying, setIsPlaying] = useState(true);
  const [displayedDate, setDisplayedDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(true);
  const [labels, setLabels] = useState<PlanetariumOverlayLabel[]>([]);

  // ─── Sélection (phase 5) ──────────────────────────────────────────────────
  const [selectedObject, setSelectedObject] = useState<PickedObject | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<CatalogObjectDetail | null>(null);
  const [sheetMinimized, setSheetMinimized] = useState(false);
  // SharedValue (pas un useState) : écrite à 60 fps depuis la boucle RAF, voir SelectionMarker.
  const selectionPoint = useSharedValue<SelectionMarkerPoint>({ x: 0, y: 0, visible: false });
  // Miroir de `selectedObject` lisible depuis la boucle RAF (closure créée une seule fois dans
  // onContextCreate, ne voit jamais les re-renders suivants) — même pattern que `observerRef`.
  const selectedRef = useRef<PickedObject | null>(null);

  // ─── Boutons/panneaux (recherche, calques, champ, horloge) ────────────────
  // Boutons statiques toujours visibles, empilés en haut à droite — pas de dock/éventail animé (voir
  // le retour utilisateur), chaque bouton ouvre/ferme directement son propre panneau, comme sur
  // `main`.
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [layersPanelVisible, setLayersPanelVisible] = useState(false);
  const [timePanelExpanded, setTimePanelExpanded] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(DEFAULT_LAYER_VISIBILITY);
  // Miroir lisible depuis la boucle RAF (closure créée une seule fois), même pattern que `selectedRef`.
  const layerVisibilityRef = useRef(layerVisibility);
  layerVisibilityRef.current = layerVisibility;

  // ─── Simulateur de champ ────────────────────────────────────────────────────
  const [fieldPickerVisible, setFieldPickerVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<FieldSimulatorCombo | null>(null);
  // FOV vertical courant de la caméra (degrés) — écrit à 60 fps par la boucle RAF, lu par
  // FieldOfViewOverlay pour mettre à l'échelle le cadre en direct pendant un pinch (voir ce
  // composant : un simple `transform: scale`, pas de recalcul de mise en page à chaque frame).
  const cameraFovShared = useSharedValue(75);
  const fieldOfView = useMemo(() => (selectedCombo ? getComboFieldOfView(selectedCombo) : null), [selectedCombo]);

  // Le GLView ne monte qu'une fois cette mesure confirmée (onLayout), avec une taille EXPLICITE (pas
  // `flex: 1`) — montée trop tôt ou en flex, sa surface GL native capte une taille transitoire
  // (potentiellement 0×0, le temps que le parent plein écran termine sa mise en page) et ne se
  // redimensionne jamais après (`gl.drawingBufferWidth/Height` resteraient figés dessus pour toute la
  // durée de vie du contexte) — même piège que MoonPhase/Model3DViewer, déjà documenté là-bas.
  const [layoutSize, setLayoutSize] = useState<{ width: number; height: number } | null>(null);
  // Changer cette clé force React à démonter/remonter le <GLView> — nécessaire au retour de focus
  // (voir useFocusEffect ci-dessous) : le contexte GL natif sous-jacent est perdu quand l'onglet est
  // masqué (ex: aller sur la fiche d'un objet puis revenir), la GLView reste bien montée côté React
  // mais son rendu reste figé/noir pour toujours si on ne force pas cette recréation.
  const [glKey, setGlKey] = useState(0);
  const hasBlurredRef = useRef(false);

  // Icônes de la barre de statut en clair tant que l'écran a le focus (fond noir plein écran) — pas
  // de reset au blur, l'écran suivant fixe déjà la sienne à son propre focus (même convention que
  // ScreenHeader).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");

      if (hasBlurredRef.current) {
        hasBlurredRef.current = false;
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        if (sceneRef.current) {
          shutdownScene(sceneRef.current);
          sceneRef.current = null;
        }
        setIsLoading(true);
        setGlKey((key) => key + 1);
      }

      return () => {
        hasBlurredRef.current = true;
      };
    }, [])
  );

  // `useMemo` (pas un objet recréé à chaque render) : passé tel quel à ObjectSelectionSheet, qui ne
  // doit se re-rendre QUE si la position change réellement, pas à chaque re-rendu de cet écran (ex:
  // `setDisplayedDate` ~20/s) — sinon tout l'intérieur de la feuille (dont le SVG d'AltitudeChart,
  // bien plus lourd) se re-rendrait à ce rythme pendant qu'une sélection est affichée, perceptible
  // comme un ralentissement du pan/pinch (retour utilisateur).
  const observer: GeographicCoordinate | null = useMemo(
    () => (location ? { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 } : null),
    [location?.latitude, location?.longitude, location?.elevation]
  );
  observerRef.current = observer;
  selectedRef.current = selectedObject;

  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const refs = sceneRef.current;
    if (!refs) return;
    shutdownScene(refs);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((previous) => {
      const next = !previous;
      isPlayingRef.current = next;
      if (next) playAnchorRef.current = { wallMs: performance.now(), simDate: simDateRef.current };
      return next;
    });
  }, []);

  // Décale l'horloge de simulation de `deltaMs` (± une heure/un jour) depuis l'instant affiché
  // actuellement, que la lecture soit en cours ou en pause — ne change pas l'état lecture/pause.
  const adjustTime = useCallback((deltaMs: number) => {
    const current = isPlayingRef.current
      ? new Date(playAnchorRef.current.simDate.getTime() + (performance.now() - playAnchorRef.current.wallMs))
      : simDateRef.current;
    const next = new Date(current.getTime() + deltaMs);
    simDateRef.current = next;
    playAnchorRef.current = { wallMs: performance.now(), simDate: next };
  }, []);

  const resetToNow = useCallback(() => {
    const now = new Date();
    simDateRef.current = now;
    playAnchorRef.current = { wallMs: performance.now(), simDate: now };
    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObject(null);
    setSelectedDetail(null);
    selectionPoint.value = { x: 0, y: 0, visible: false };
  }, [selectionPoint]);

  // `useCallback` (pas des flèches inline dans le JSX) : des props stables permettent à
  // `React.memo(ObjectSelectionSheet)` de sauter son re-rendu quand cet écran se re-rend pour autre
  // chose (voir le commentaire sur `observer` plus bas).
  const expandSheet = useCallback(() => setSheetMinimized(false), []);
  const minimizeSheet = useCallback(() => setSheetMinimized(true), []);

  // Tap sur un objet : sélection immédiate (nom/catégorie déjà en main pour étoile/DSO, voir
  // ObjectSelectionSheet), vol de caméra vers sa position courante, puis fiche complète chargée en
  // tâche de fond (`getObjectById`) — jamais utilisée pour la position (voir SolarSystemLayer).
  const selectObject = useCallback((picked: PickedObject, ra: number, dec: number) => {
    setSelectedObject(picked);
    setSelectedDetail(null);
    setSheetMinimized(false);
    sceneRef.current?.controller.animateTo(ra, dec);

    const catalogId = picked.kind === "solar_system" ? SOLAR_SYSTEM_CATALOG_ID[picked.bodyId] : picked.object.id;
    getObjectById(catalogId).then((detail) => {
      // L'utilisateur a pu sélectionner autre chose (ou tout désélectionner) pendant l'aller-retour
      // réseau : ne jamais écraser une sélection plus récente avec une réponse devenue obsolète.
      if (selectedRef.current && isSamePickedObject(selectedRef.current, picked)) setSelectedDetail(detail);
    });
  }, []);

  const handleTap = useCallback((tapX: number, tapY: number) => {
    const refs = sceneRef.current;
    if (!refs) return;

    const picked = pickObjectAtScreenPoint(tapX, tapY, {
      camera: refs.camera,
      width: glViewWidthLogicalRef.current,
      height: refs.glViewHeight / PixelRatio.get(),
      zenith: refs.zenithVec,
      solarSystemSnapshot: solarSystemSnapshotRef.current,
      stars: refs.stars,
      dsoObjects: refs.dsoObjects,
    });

    if (!picked) {
      clearSelection();
      return;
    }

    const coord =
      picked.kind === "solar_system" ? solarSystemSnapshotRef.current[picked.bodyId] : picked.object.position ?? undefined;
    if (!coord) return;
    selectObject(picked, coord.ra, coord.dec);
  }, [clearSelection, selectObject]);

  const toggleLayer = useCallback((key: keyof LayerVisibility) => {
    setLayerVisibility((previous) => ({ ...previous, [key]: !previous[key] }));
    // Ces bascules changent le contenu des étiquettes (constellations, coordonnées de grille — voir
    // la boucle RAF), qui ne se recalcule normalement que si la caméra a bougé (`cameraMoved`) — sans
    // ça, désactiver une couche à l'arrêt laisserait ses étiquettes affichées jusqu'au prochain geste.
    if (key === "constellations" || key === "eqGrid" || key === "azGrid") {
      lastLabelCameraRef.current = { ra: Infinity, dec: Infinity, fov: Infinity };
    }
  }, []);

  // Résultat de recherche (phase 6) → même sélection + vol de caméra qu'un tap direct sur l'objet.
  // `kind: "small_body"` (comètes/astéroïdes) n'est pas affiché dans la scène 3D pour l'instant (ni
  // récupéré, ni sa position calculée) : on ouvre directement sa fiche complète plutôt que de
  // simuler une sélection qu'on ne peut pas positionner sur le ciel.
  const selectFromSearchResult = useCallback((object: CatalogObjectSummary) => {
    if (object.kind === "solar_system") {
      const bodyId = getSolarSystemBodyIdForCatalogId(object.id);
      const coord = bodyId ? solarSystemSnapshotRef.current[bodyId] : undefined;
      if (bodyId && coord) selectObject({ kind: "solar_system", bodyId }, coord.ra, coord.dec);
      return;
    }

    if (object.position) {
      selectObject({ kind: object.kind === "dso" ? "dso" : "star", object }, object.position.ra, object.position.dec);
      return;
    }

    router.push(`/objects/${object.id}`);
  }, [selectObject]);

  // Un seul panneau ouvert à la fois : ouvrir l'un referme les autres, comme sur `main`
  // (handleShowSearch/handleShowLayers/handleShowTimeline s'excluent mutuellement).
  const openSearch = useCallback(() => {
    setLayersPanelVisible(false);
    setFieldPickerVisible(false);
    setSearchModalVisible(true);
  }, []);

  const toggleLayersPanel = useCallback(() => {
    setSearchModalVisible(false);
    setFieldPickerVisible(false);
    setLayersPanelVisible((visible) => !visible);
  }, []);

  const toggleFieldPicker = useCallback(() => {
    setSearchModalVisible(false);
    setLayersPanelVisible(false);
    setFieldPickerVisible((visible) => !visible);
  }, []);

  const toggleTimePanel = useCallback(() => {
    setSearchModalVisible(false);
    setLayersPanelVisible(false);
    setFieldPickerVisible(false);
    setTimePanelExpanded((expanded) => !expanded);
  }, []);

  const selectCombo = useCallback((combo: FieldSimulatorCombo) => {
    setSelectedCombo(combo);
    setFieldPickerVisible(false);
  }, []);

  const clearCombo = useCallback(() => {
    setSelectedCombo(null);
    setFieldPickerVisible(false);
  }, []);

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    if (!observerRef.current) return;
    const now = new Date();
    lastEphemerisDateRef.current = now;

    const refs = await buildScene(gl, observerRef.current, now);
    sceneRef.current = refs;
    glViewWidthLogicalRef.current = refs.glViewWidth / PixelRatio.get();
    setIsLoading(false);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const refs2 = sceneRef.current;
      const obs = observerRef.current;
      if (!refs2 || !obs) return;

      const { controller } = refs2;
      const wasAnimating = controller.isAnimating;
      if (wasAnimating) controller.tickAnimation();
      if (!wasAnimating) controller.tickInertia(glViewWidthLogicalRef.current);
      controller.tickFov();
      updateStarFovScale(refs2.starsCloud, controller.fov);
      updateDsoFovScale(refs2.dsoCloud, controller.fov);
      updateSolarSystemFovScale(refs2.solarSystem, controller.fov);
      cameraFovShared.value = controller.fov;

      // Horloge de simulation : en lecture, avance à 1:1 avec le temps réel depuis l'ancre ; en
      // pause, reste figée sur le dernier instant choisi (pas recalculée depuis `new Date()`).
      const nowMs = performance.now();
      const rafDate = isPlayingRef.current
        ? new Date(playAnchorRef.current.simDate.getTime() + (nowMs - playAnchorRef.current.wallMs))
        : simDateRef.current;

      // Compensation de la dérive sidérale, à chaque frame : reconvertit la direction de visée
      // courante (alt/az à l'heure précédente → RA/Dec à l'heure actuelle) pour garder la caméra
      // calée sur le même coin de ciel pendant que le temps simulé avance, plutôt que de dériver
      // avec les étoiles en dessous. Ignoré tout près du zénith/nadir : le repère alt/az y est
      // dégénéré et l'écart induit y est de toute façon négligeable.
      const horizontal = convertEquatorialToHorizontal(lastEphemerisDateRef.current, obs, {
        ra: controller.lookRa,
        dec: controller.lookDec,
      });
      if (Math.abs(horizontal.alt) < 85) {
        const corrected = convertHorizontalToEquatorial(rafDate, obs, { alt: horizontal.alt, az: horizontal.az });
        if (Number.isFinite(corrected.ra) && Number.isFinite(corrected.dec)) {
          controller.setLook(corrected.ra, corrected.dec);
        }
      }
      lastEphemerisDateRef.current = rafDate;

      if (nowMs - lastEphemerisFrameMsRef.current >= EPHEMERIS_INTERVAL_MS) {
        lastEphemerisFrameMsRef.current = nowMs;
        setDisplayedDate(rafDate);

        const sunCoord = getSolarEquatorialCoordinate(rafDate);
        const sunHorizontal = convertEquatorialToHorizontal(rafDate, obs, sunCoord);
        updateAtmosphere(
          refs2.atmosphere,
          { ra: sunCoord.ra, dec: sunCoord.dec, altitudeDeg: sunHorizontal.alt },
          refs2.starsCloud,
          refs2.zenithVec
        );
        // Même seuil de crépuscule que les étoiles (voir updateAtmosphere), mais DsoLayer n'est pas
        // couplé à AtmosphereLayer (pas de dépendance croisée entre les deux) : écriture directe de
        // l'uniform ici plutôt que d'élargir la signature d'updateAtmosphere pour un seul champ.
        const dsoMaterial = refs2.dsoCloud.material as THREE.ShaderMaterial;
        if (dsoMaterial.uniforms?.uSunAlt) dsoMaterial.uniforms.uSunAlt.value = sunHorizontal.alt;

        orientGroundToHorizon(refs2.ground, obs, rafDate);
        orientAzGridToHorizon(refs2.azGrid, obs, rafDate);
        const zenithEq = convertHorizontalToEquatorial(rafDate, obs, { alt: 90, az: 0 });
        refs2.zenithVec.copy(raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize());
        controller.setZenith(refs2.zenithVec);

        // Bascules de couches (phase 7) : simple affectation de `.visible, pas besoin d'un rythme plus
        // fin que l'éphéméride (imperceptible, un réglage n'est pas un geste continu).
        const layerVisibility = layerVisibilityRef.current;
        refs2.constellationLines.visible = layerVisibility.constellations;
        refs2.eqGrid.visible = layerVisibility.eqGrid;
        refs2.azGrid.visible = layerVisibility.azGrid;
        refs2.ground.visible = layerVisibility.ground;
        refs2.atmosphere.visible = layerVisibility.atmosphere;

        const solarSystemSnapshot = computeSolarSystemSnapshot(rafDate, obs);
        updateSolarSystemLayer(refs2.solarSystem, solarSystemSnapshot);
        solarSystemSnapshotRef.current = solarSystemSnapshot;

        compassEquatorialRef.current = CARDINAL_AZIMUTHS.map(
          (azimuth) => convertHorizontalToEquatorial(rafDate, obs, { alt: 0, az: azimuth })
        );
      }

      // La caméra doit être à jour AVANT de projeter les étiquettes (sinon elles sont projetées avec
      // l'orientation de la frame PRÉCÉDENTE, un décalage visible en plus du throttle ci-dessus).
      controller.applyToCamera(refs2.camera);
      // `applyToCamera` (lookAt + updateProjectionMatrix) ne touche PAS `camera.matrixWorld`/
      // `matrixWorldInverse` — en temps normal, seul `renderer.render()` les recalcule, mais ça
      // n'arrive qu'à la fin de cette boucle, APRÈS nos projections 2D (`projectRaDecToScreen`, qui
      // utilise `Vector3.project(camera)`, lequel lit `matrixWorldInverse`). Sans cet appel, chaque
      // étiquette/le marqueur de sélection se projette avec la matrice de la frame PRÉCÉDENTE — un
      // retard constant d'une frame, très visible comme un effet "élastique" pendant l'inertie du pan
      // (rapporté par l'utilisateur). `updateMatrixWorld()` la recalcule immédiatement, sans attendre
      // le rendu.
      refs2.camera.updateMatrixWorld();
      // Même raison que pour la caméra : l'orientation de la grille azimutale change à chaque tick
      // d'éphéméride (voir orientAzGridToHorizon) mais son `matrixWorld` ne se rafraîchit normalement
      // qu'au rendu, APRÈS les étiquettes de coordonnées de bord (getGridEdgeLabels, plus bas) — sans
      // cet appel, ses chiffres resteraient affichés avec la rotation de la frame précédente.
      refs2.eqGrid.updateMatrixWorld();
      refs2.azGrid.updateMatrixWorld();

      // ── Étiquettes 2D (constellations + boussole + Soleil/Lune/planètes) ────────────────────────
      // Reprojetées à CHAQUE frame (la projection écran elle-même est une simple multiplication de
      // matrice, peu coûteuse) — seules les coordonnées RA/Dec sources restent throttlées ci-dessus.
      // Ne redéclenche `setLabels` (rendu React) que si la caméra a réellement bougé depuis la frame
      // précédente, pour ne pas payer ce coût à l'arrêt.
      const cameraMoved =
        Math.abs(controller.lookRa - lastLabelCameraRef.current.ra) > LABEL_CAMERA_EPSILON ||
        Math.abs(controller.lookDec - lastLabelCameraRef.current.dec) > LABEL_CAMERA_EPSILON ||
        Math.abs(controller.fov - lastLabelCameraRef.current.fov) > LABEL_CAMERA_EPSILON;

      if (cameraMoved) {
        lastLabelCameraRef.current = { ra: controller.lookRa, dec: controller.lookDec, fov: controller.fov };

        const width = glViewWidthLogicalRef.current;
        const height = refs2.glViewHeight / PixelRatio.get();
        const nextLabels: PlanetariumOverlayLabel[] = [];
        const zenith = refs2.zenithVec;

        if (layerVisibilityRef.current.constellations) {
          for (const definition of refs2.constellationLabelDefinitions) {
            const direction = raDecToVec3(definition.raDeg, definition.decDeg, 1).normalize();
            if (direction.dot(zenith) < 0) continue; // sous l'horizon
            const point = projectRaDecToScreen(refs2.camera, definition.raDeg, definition.decDeg, width, height);
            if (point) nextLabels.push({ key: `const-${definition.key}`, ...point, text: definition.text, variant: "constellation" });
          }
        }

        CARDINAL_AZIMUTHS.forEach((azimuth, index) => {
          const eq = compassEquatorialRef.current[index];
          if (!eq) return;
          const point = projectRaDecToScreen(refs2.camera, eq.ra, eq.dec, width, height);
          if (point) nextLabels.push({ key: `cardinal-${azimuth}`, ...point, text: CARDINAL_LETTERS[index], variant: "compass" });
        });

        for (const body of SOLAR_SYSTEM_BODY_IDS) {
          const coord = solarSystemSnapshotRef.current[body];
          if (!coord) continue;
          const direction = raDecToVec3(coord.ra, coord.dec, 1).normalize();
          if (direction.dot(zenith) < 0) continue;
          const point = projectRaDecToScreen(refs2.camera, coord.ra, coord.dec, width, height);
          if (point) {
            nextLabels.push({ key: `body-${body}`, x: point.x, y: point.y + 12, text: getSolarSystemBodyLabel(body, tRef.current), variant: "solarSystem" });
          }
        }

        // Coordonnées de grille en bordure d'écran (déjà court-circuité si la grille est masquée,
        // voir getGridEdgeLabels) : un seul point d'ancrage par ligne visible.
        for (const label of getGridEdgeLabels(refs2.eqGrid, refs2.camera, width, height, false)) {
          nextLabels.push({ ...label, variant: "eqGridCoordinate" });
        }
        for (const label of getGridEdgeLabels(refs2.azGrid, refs2.camera, width, height, true)) {
          nextLabels.push({ ...label, variant: "azGridCoordinate" });
        }

        setLabels(nextLabels);
      }

      // ── Marqueur de sélection (phase 5) ─────────────────────────────────────────────────────────
      // Reprojeté à CHAQUE frame (pas throttlé) : un seul point, négligeable, et un corps du système
      // solaire sélectionné bouge en continu si l'horloge est en lecture.
      const selected = selectedRef.current;
      if (selected) {
        const coord =
          selected.kind === "solar_system" ? solarSystemSnapshotRef.current[selected.bodyId] : selected.object.position ?? undefined;
        const direction = coord ? raDecToVec3(coord.ra, coord.dec, 1).normalize() : null;
        const aboveHorizon = !!coord && !!direction && direction.dot(refs2.zenithVec) >= 0;
        const point = aboveHorizon
          ? projectRaDecToScreen(refs2.camera, coord!.ra, coord!.dec, glViewWidthLogicalRef.current, refs2.glViewHeight / PixelRatio.get())
          : null;
        selectionPoint.value = point ? { x: point.x, y: point.y, visible: true } : { ...selectionPoint.value, visible: false };
      }

      refs2.renderer.render(refs2.scene, refs2.camera);
      gl.endFrameEXP();
    };
    loop();
  }, []);

  // `.runOnJS(true)` : indispensable ici — par défaut (Reanimated 4 + react-native-worklets), ces
  // callbacks tournent sur le UI runtime comme des worklets, et plantent ("Tried to synchronously
  // call a Remote Function") dès qu'ils touchent un objet JS normal non-worklet (notre
  // `CameraController`, les refs `sceneRef`/`prevTranslationRef`, les fonctions importées de
  // PanHandler/PinchHandler). Contrairement à ZoomableImage/Model3DViewer (shared values
  // Reanimated, donc worklet-safe), la caméra du planétarium est un état JS classique partagé avec
  // la boucle RAF — on ramène volontairement ces gestes sur le thread JS plutôt que de réécrire
  // toute la couche caméra en shared values.
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      if (sceneRef.current) onPanStart(event, sceneRef.current.controller);
      prevTranslationRef.current = { x: 0, y: 0 };
    })
    .onChange((event) => {
      if (sceneRef.current) onPanChange(event, sceneRef.current.controller, glViewWidthLogicalRef.current, prevTranslationRef.current);
    })
    .onEnd((event) => {
      if (sceneRef.current) onPanEnd(event, sceneRef.current.controller);
    });

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onTouchesDown((event) => onPinchDown(event))
    .onTouchesMove((event) => {
      if (sceneRef.current) onPinchMove(event, sceneRef.current.controller);
    });

  // `Gesture.Race` (pas `Simultaneous`) entre le tap et pan/pinch : un tap s'active vite sur un
  // appui court et quasi immobile, un pan a besoin d'un minimum de déplacement pour s'activer — le
  // premier des deux à s'activer "gagne" et annule l'autre, exactement le comportement voulu
  // (sélectionner sans jamais déclencher un petit pan parasite, et inversement).
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => handleTap(event.x, event.y));

  const composedGestures = Gesture.Race(tapGesture, Gesture.Simultaneous(panGesture, pinchGesture));

  if (!observer) {
    return (
      <View style={[styles.screen, styles.loaderOverlay]}>
        <ActivityIndicator size="large" color={app_colors.white} />
      </View>
    );
  }

  return (
    <View
      style={styles.screen}
      onLayout={(event) => {
        // Lire `layout` tout de suite : RN recycle l'objet évènement synthétique après ce callback,
        // le relire plus tard (ex: dans le lazy updater de `setLayoutSize`) renvoie `nativeEvent: null`.
        const { width, height } = event.nativeEvent.layout;
        setLayoutSize((previous) => previous ?? { width, height });
      }}
    >
      {layoutSize && (
        <GestureDetector gesture={composedGestures}>
          <GLView key={glKey} style={{ width: layoutSize.width, height: layoutSize.height }} onContextCreate={onContextCreate} />
        </GestureDetector>
      )}

      <PlanetariumLabelsOverlay labels={labels} />
      <SelectionMarker point={selectionPoint} />

      {selectedObject && (
        <ObjectSelectionSheet
          picked={selectedObject}
          detail={selectedDetail}
          observer={observer}
          minimized={sheetMinimized}
          onExpand={expandSheet}
          onMinimize={minimizeSheet}
          onClose={clearSelection}
          bottomInset={insets.bottom}
        />
      )}

      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={app_colors.white} />
        </View>
      )}

      {!isLoading && (
        <TimeControlPanel
          expanded={timePanelExpanded}
          dateLabel={formatDate(displayedDate).format("DD/MM/YYYY HH:mm:ss")}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onAdjust={adjustTime}
          onReset={resetToNow}
          bottom={insets.bottom + 20}
        />
      )}

      <FieldOfViewOverlay
        fieldOfView={fieldOfView}
        cameraFovDeg={cameraFovShared}
        viewportWidth={layoutSize?.width ?? 0}
        viewportHeight={layoutSize?.height ?? 0}
      />

      {!isLoading && (
        <>
          <View style={[styles.topLeftActions, { top: insets.top + 12 }]}>
            <PlanetariumIconButton icon={ChevronLeft} onPress={() => router.push("/")} />
          </View>

          <View style={[styles.topRightActions, { top: insets.top + 12 }]}>
            <PlanetariumIconButton icon={Layers} active={layersPanelVisible} onPress={toggleLayersPanel} />
            <PlanetariumIconButton icon={Search} onPress={openSearch} />
            <PlanetariumIconButton icon={Telescope} active={!!selectedCombo} onPress={toggleFieldPicker} />
            <PlanetariumIconButton icon={Clock} active={timePanelExpanded} onPress={toggleTimePanel} />
          </View>
        </>
      )}

      <LayerSettingsPanel
        visible={layersPanelVisible}
        layerVisibility={layerVisibility}
        onToggle={toggleLayer}
        onClose={() => setLayersPanelVisible(false)}
        top={insets.top + 12 + styles.topRightActions.stackHeight}
      />

      <FieldSimulatorPicker
        visible={fieldPickerVisible}
        selectedComboId={selectedCombo?.id ?? null}
        onSelect={selectCombo}
        onClear={clearCombo}
        onClose={() => setFieldPickerVisible(false)}
        top={insets.top + 12 + styles.topRightActions.stackHeight}
      />

      <ExploreSearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSelectObject={selectFromSearchResult}
      />
    </View>
  );
};

export default ExploreScreen;
