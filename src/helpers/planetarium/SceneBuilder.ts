import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { Dayjs } from 'dayjs';
import { convertHorizontalToEquatorial } from '@observerly/astrometry';

import { LocationObject } from '../types/LocationObject';
import { Star } from '../types/Star';
import { DSO } from '../types/DSO';
import { CameraController } from './core/CameraController';
import { PlanetariumLoadingReporter } from './utils/loadingReporter';
import { raDecToVec3 } from './utils/coordinates';
import { LAYER_NAMES } from './utils/renderOrders';

import { createBackgroundLayer } from './layers/BackgroundLayer';
import { createGroundLayer } from './layers/GroundLayer';
import { createAtmosphereLayer } from './layers/AtmosphereLayer';
import { createStarsLayer } from './layers/StarsLayer';
import { SolarSystemLayer, SolarSystemSnapshot, computeSolarSystemSnapshot } from './layers/SolarSystemLayer';
import { createDSOLayer } from './layers/DSOLayer';
import { createConstellationLines, createConstellationLabels } from './layers/ConstellationsLayer';
import { createGridLayer, GridLayerResult } from './layers/GridLayer';
import { createCompassLayer } from './layers/CompassLayer';
import { createSelectionCircle } from './layers/SelectionCircle';

export type SceneRefs = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: ExpoTHREE.Renderer;
  controller: CameraController;
  ground: THREE.Mesh;
  atmosphere: THREE.Mesh;
  solarSystemLayer: SolarSystemLayer;
  starsCloud: THREE.Points;
  dsoGroup: THREE.Group;
  eqGrid: THREE.Group;
  azGrid: THREE.Group;
  compassLabels: THREE.Group;
  constellationLines: THREE.Group;
  constellationLabels: THREE.Group;
  selectionCircle: THREE.Group;
  zenithVec: THREE.Vector3;
  glViewWidth: number;
  glViewHeight: number;
  initialSnapshot: SolarSystemSnapshot;
};

export async function buildScene(
  gl: ExpoWebGLRenderingContext,
  location: LocationObject,
  visibleStars: Star[],
  getDsoCatalog: () => DSO[],
  referenceDate: Dayjs,
  setSelectedObject: (obj: any) => void,
  reporter?: PlanetariumLoadingReporter,
): Promise<SceneRefs> {
  reporter?.({ stepId: 'scene', title: 'Scene bootstrap', detail: 'Creating scene, camera and renderer', status: 'active' });

  const glViewWidth  = gl.drawingBufferWidth;
  const glViewHeight = gl.drawingBufferHeight;
  const dateObj = referenceDate.toDate();
  const observer = { latitude: location.lat, longitude: location.lon };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, glViewWidth / Math.max(1, glViewHeight), 0.1, 200);
  const renderer = new ExpoTHREE.Renderer({ gl } as any);
  renderer.setPixelRatio(1);
  renderer.setSize(glViewWidth, glViewHeight);

  // Initial zenith direction for ground visibility culling
  const zenithEq = convertHorizontalToEquatorial(dateObj, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  // Initial look: south at 30° altitude (good first-run view)
  const southAt30 = convertHorizontalToEquatorial(dateObj, observer, { alt: 30, az: 180 });
  const controller = new CameraController(southAt30.ra, southAt30.dec, 75);

  reporter?.({ stepId: 'scene', title: 'Scene bootstrap', detail: 'Scene, camera and renderer ready', status: 'done' });

  const initialSnapshot = await computeSolarSystemSnapshot(referenceDate, observer);

  // Load async layers in parallel: background, constellation labels, compass
  const [background, constellationLabelsGroup, compassLabels] = await Promise.all([
    createBackgroundLayer(reporter),
    createConstellationLabels(reporter),
    createCompassLayer(location, dateObj, 0.98, reporter),
  ]);

  reporter?.({ stepId: 'grids', title: 'Coordinate grids', detail: 'Building EQ and AZ grids', status: 'active' });
  const { eqGrid, azGrid } = createGridLayer(location, dateObj);
  reporter?.({ stepId: 'grids', title: 'Coordinate grids', detail: 'Coordinate grids ready', status: 'done' });

  reporter?.({ stepId: 'ground', title: 'Horizon mask', detail: 'Computing local horizon', status: 'active' });
  const ground = createGroundLayer(location, dateObj);
  reporter?.({ stepId: 'ground', title: 'Horizon mask', detail: 'Horizon mask ready', status: 'done' });

  reporter?.({ stepId: 'atmosphere', title: 'Atmosphere shader', detail: 'Creating atmosphere dome', status: 'active' });
  const atmosphere = createAtmosphereLayer(initialSnapshot.sunData);
  reporter?.({ stepId: 'atmosphere', title: 'Atmosphere shader', detail: 'Atmosphere dome ready', status: 'done' });

  const starsCloud = createStarsLayer(visibleStars, setSelectedObject, reporter);
  const solarSystemLayer = new SolarSystemLayer(initialSnapshot, setSelectedObject, reporter);
  const dsoGroup = createDSOLayer(getDsoCatalog, setSelectedObject, reporter);
  const constellationLines = createConstellationLines();
  const selectionCircle = createSelectionCircle();
  selectionCircle.name = LAYER_NAMES.selectionCircle;

  reporter?.({ stepId: 'finalize', title: 'Final assembly', detail: 'Assembling scene graph', status: 'active' });

  scene.add(background);
  scene.add(atmosphere);
  scene.add(ground);
  scene.add(starsCloud);
  scene.add(dsoGroup);
  scene.add(constellationLines);
  scene.add(constellationLabelsGroup);
  scene.add(eqGrid);
  scene.add(azGrid);
  scene.add(compassLabels);
  scene.add(selectionCircle);
  solarSystemLayer.addToScene(scene);

  controller.applyToCamera(camera);

  reporter?.({ stepId: 'finalize', title: 'Final assembly', detail: 'Scene ready for first render', status: 'done' });

  return {
    scene,
    camera,
    renderer,
    controller,
    ground,
    atmosphere,
    solarSystemLayer,
    starsCloud,
    dsoGroup,
    eqGrid,
    azGrid,
    compassLabels,
    constellationLines,
    constellationLabels: constellationLabelsGroup,
    selectionCircle,
    zenithVec,
    glViewWidth,
    glViewHeight,
    initialSnapshot,
  };
}
