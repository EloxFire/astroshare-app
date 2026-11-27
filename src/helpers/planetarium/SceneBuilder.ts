import * as THREE from "three";
import { Renderer } from "expo-three";
import type { ExpoWebGLRenderingContext } from "expo-gl";
import {
  convertEquatorialToHorizontal,
  convertHorizontalToEquatorial,
  getSolarEquatorialCoordinate,
  type GeographicCoordinate,
} from "@observerly/astrometry";
import { filterUnsupportedPixelStorei } from "../expoGL";
import { listObjects } from "../api/catalog/objects";
import type { CatalogObjectSummary } from "../../types/catalog/CatalogObject";
import { CameraController } from "./core/CameraController";
import { raDecToVec3 } from "./utils/coordinates";
import { createGroundLayer } from "./layers/GroundLayer";
import { createAtmosphereLayer, updateAtmosphere } from "./layers/AtmosphereLayer";
import { createStarsLayer } from "./layers/StarsLayer";
import { createDsoLayer } from "./layers/DsoLayer";
import { createConstellationLines, getConstellationLabelDefinitions, type ConstellationLabelDefinition } from "./layers/ConstellationsLayer";
import { createGridLayer, orientAzGridToHorizon, type GridLayerResult } from "./layers/GridLayer";
import { computeSolarSystemSnapshot, createSolarSystemLayer } from "./layers/SolarSystemLayer";

// Limite de magnitude des étoiles chargées (phase 1) : ~1700 étoiles de tout le ciel, une seule
// requête (le serveur plafonne à 2000/page, voir listObjects) — pas de requête par zone visible pour
// l'instant (voir le plan, affinement possible plus tard si la densité le justifie).
const STAR_MAX_MAGNITUDE = 5.5;
const STAR_FETCH_LIMIT = 2000;

// Même principe que les étoiles (une seule requête plein ciel) : les DSO visibles à l'œil nu/aux
// jumelles vont nettement plus profond en magnitude que les étoiles affichées (le catalogue Messier/
// NGC/IC couvre bien plus large), d'où un plafond plus haut.
const DSO_MAX_MAGNITUDE = 12;
const DSO_FETCH_LIMIT = 2000;

export type SceneRefs = {
  renderer: Renderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controller: CameraController;
  ground: THREE.Mesh;
  atmosphere: THREE.Mesh;
  starsCloud: THREE.Points;
  dsoCloud: THREE.Points;
  // Données sources des deux nuages de points ci-dessus, dans le MÊME ORDRE que leurs attributs de
  // géométrie (l'index d'un point retrouvé par la sélection — phase 5 — pointe directement dans ces
  // tableaux).
  stars: CatalogObjectSummary[];
  dsoObjects: CatalogObjectSummary[];
  constellationLines: THREE.Group;
  eqGrid: THREE.Group;
  azGrid: THREE.Group;
  solarSystem: THREE.Points;
  zenithVec: THREE.Vector3;
  glViewWidth: number;
  glViewHeight: number;
  // Statique (ne dépend pas de la date) — calculé une seule fois ici, projeté à l'écran à chaque
  // tick d'éphéméride throttlé par ExploreScreen.
  constellationLabelDefinitions: ConstellationLabelDefinition[];
};

const fetchStars = async (): Promise<CatalogObjectSummary[]> => {
  const response = await listObjects({ kind: "star", maxMag: STAR_MAX_MAGNITUDE, limit: STAR_FETCH_LIMIT });
  return response?.data.filter((star) => star.position) ?? [];
};

const fetchDso = async (): Promise<CatalogObjectSummary[]> => {
  const response = await listObjects({ kind: "dso", maxMag: DSO_MAX_MAGNITUDE, limit: DSO_FETCH_LIMIT });
  return response?.data.filter((dso) => dso.position) ?? [];
};

// Construit la scène three.js complète (sol/horizon, atmosphère, étoiles, DSO, constellations,
// grilles, système solaire) — appelé une seule fois depuis `onContextCreate` de la GLView.
export const buildScene = async (
  gl: ExpoWebGLRenderingContext,
  observer: GeographicCoordinate,
  date: Date
): Promise<SceneRefs> => {
  const glViewWidth = gl.drawingBufferWidth;
  const glViewHeight = gl.drawingBufferHeight;

  filterUnsupportedPixelStorei(gl);

  const renderer = new Renderer({ gl, width: glViewWidth, height: glViewHeight, pixelRatio: 1 });
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, glViewWidth / glViewHeight, 0.01, 200);

  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  const controller = new CameraController(zenithEq.ra, Math.min(89, observer.latitude + 20), 75);
  controller.setZenith(zenithVec);

  const ground = createGroundLayer(observer, date);
  scene.add(ground);

  const sunCoord = getSolarEquatorialCoordinate(date);
  const sunHorizontal = convertEquatorialToHorizontal(date, observer, sunCoord);
  const atmosphere = createAtmosphereLayer({ ra: sunCoord.ra, dec: sunCoord.dec, altitudeDeg: sunHorizontal.alt });
  scene.add(atmosphere);

  const [stars, dsoObjects] = await Promise.all([fetchStars(), fetchDso()]);
  const starsCloud = createStarsLayer(stars);
  scene.add(starsCloud);

  const dsoCloud = createDsoLayer(dsoObjects);
  scene.add(dsoCloud);

  updateAtmosphere(atmosphere, { ra: sunCoord.ra, dec: sunCoord.dec, altitudeDeg: sunHorizontal.alt }, starsCloud, zenithVec);

  const constellationLines = createConstellationLines();
  scene.add(constellationLines);
  const constellationLabelDefinitions = getConstellationLabelDefinitions();

  const { eqGrid, azGrid }: GridLayerResult = createGridLayer();
  orientAzGridToHorizon(azGrid, observer, date);
  scene.add(eqGrid);
  scene.add(azGrid);

  const solarSystemSnapshot = computeSolarSystemSnapshot(date, observer);
  const solarSystem = createSolarSystemLayer(solarSystemSnapshot);
  scene.add(solarSystem);

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  return {
    renderer,
    scene,
    camera,
    controller,
    ground,
    atmosphere,
    starsCloud,
    dsoCloud,
    stars,
    dsoObjects,
    constellationLines,
    eqGrid,
    azGrid,
    solarSystem,
    zenithVec,
    glViewWidth,
    glViewHeight,
    constellationLabelDefinitions,
  };
};
