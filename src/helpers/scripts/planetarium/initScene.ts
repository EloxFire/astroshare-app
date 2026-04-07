import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {ExpoWebGLRenderingContext} from "expo-gl";
import {createStars} from "./createStars";
import {Star} from "../../types/Star";
import {createGround} from "./createGround";
import {createBackground} from "./createBackground";
import {GlobalPlanet} from "../../types/GlobalPlanet";
import {createPlanets} from "./createPlanets";
import {EquatorialCoordinate, GeographicCoordinate, HorizontalCoordinate} from "@observerly/astrometry";
import {createMoon} from "./createMoon";
import {LocationObject} from "../../types/LocationObject";
import {Quaternion, Vector3} from "three";
import {createDSO} from "./createDSO";
import {drawConstellations} from "./drawConstellations";
import {createSelectionCircle} from "./createSelectionCircle";
import {createAtmosphere} from "./createAtmosphere";
import {setInitialAngles} from "./handlePanGesture";
import {createEquatorialGrid} from "./createEquatorialGrid";
import {createAzimuthalGrid} from "./createAzimutalGrid";
import {hex_colors} from "../../constants";
import {meshGroupsNames} from "./utils/planetariumSettings";
import {createSun} from "./createSun";
import {ComputedSunInfos} from "../../types/objects/ComputedSunInfos";
import {DSO} from "../../types/DSO";
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";
import { Dayjs } from "dayjs";
import {convertHorizontalToEquatorial} from "@observerly/astrometry";
import {createCompassLabels} from "./createCompassLabels";
import {createConstellationLabels} from "./createConstellationLabels";
import {PlanetariumLoadingReporter} from "./utils/loadingReporter";

export const initScene = async (
  gl: ExpoWebGLRenderingContext,
  currentUserLocation: LocationObject,
  starsCatalog: Star[],
  planetList: GlobalPlanet[],
  moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string }),
  getDsoCatalog: () => DSO[],
  sunData: ComputedSunInfos,
  setObjectInfos: React.Dispatch<any>,
  currentLocale: string,
  observer: GeographicCoordinate,
  referenceDate: Dayjs,
  reportLoading?: PlanetariumLoadingReporter
): Promise<{
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: ExpoTHREE.Renderer,
  ground: THREE.Mesh,
  atmosphere: THREE.Mesh,
  selectionCircle: THREE.Object3D,
  grids: {
    eqGrid: THREE.Group,
    azGrid: THREE.Group,
  },
  compassLabels: THREE.Group,
  quaternions: {
    groundTotalQuaternion: Quaternion,
  }
}> => {
  console.log("[GLView] Initializing scene...")
  const reportStep = (stepId: string, title: string, detail: string, status: 'pending' | 'active' | 'done' | 'error' = 'active') => {
    reportLoading?.({stepId, title, detail, status});
  };

  reportStep('scene', 'Scene bootstrap', 'Creating Three.js scene, camera, and renderer', 'active');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
  const renderer = new ExpoTHREE.Renderer({gl, antialias: true});

  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x080808);
  camera.position.set(0, 0, 0);

  const axesHelper = new THREE.AxesHelper( 3 );
  scene.add( axesHelper );
  reportStep('scene', 'Scene bootstrap', 'Renderer configured and camera positioned', 'done');

  const background = await createBackground(reportLoading)
  reportStep('ground', 'Horizon mask', 'Building local ground dome from observer position', 'active');
  const ground = createGround(currentUserLocation, referenceDate.toDate())
  reportStep('ground', 'Horizon mask', 'Ground dome aligned to zenith and north', 'done');
  const sunDirection = convertSphericalToCartesian(1, sunData.base.ra, sunData.base.dec);
  const atmosphere = createAtmosphere(sunDirection, sunData.base.alt, reportLoading);
  reportStep('constellations', 'Constellation overlays', 'Drawing constellation line segments', 'active');
  const constellations = drawConstellations()
  reportStep('constellations', 'Constellation overlays', 'Constellation lines generated', 'active');
  const constellationLabels = await createConstellationLabels(9.65, camera.fov, reportLoading);
  reportStep('finalize', 'Final assembly', 'Creating selection marker', 'active');
  const selectionCircle = createSelectionCircle()
  const compassLabels = await createCompassLabels(0.98, currentUserLocation, referenceDate.toDate(), reportLoading);

  // Camera position locked to the ground
  reportStep('finalize', 'Final assembly', 'Aligning camera orientation with local sky', 'active');
  const q1: Quaternion = new THREE.Quaternion;
  const q2: Quaternion = new THREE.Quaternion;
  const q3: Quaternion = new THREE.Quaternion;
  const x1: Vector3 = new THREE.Vector3(1, 0, 0);
  const y1: Vector3 = new THREE.Vector3(0, 0, 1);
  q1.setFromAxisAngle(y1, 0);
  q2.setFromAxisAngle(x1, Math.PI / 2);
  ground.getWorldQuaternion(q3);
  const groundTotalQuaternion: Quaternion = q3.multiply(q1).multiply(q2);
  camera.setRotationFromQuaternion(groundTotalQuaternion.normalize());

  const stars = createStars(starsCatalog, setObjectInfos, reportLoading)
  reportStep('planets', 'Planets', `Creating ${planetList.length} planet meshes`, 'active');
  const planets = createPlanets(planetList, setObjectInfos)
  reportStep('planets', 'Planets', `Planet meshes ready (${planetList.length} bodies)`, 'done');
  reportStep('moon', 'Moon', `Creating moon mesh for phase ${moonCoords.phase}`, 'active');
  const moon = createMoon(moonCoords, setObjectInfos)
  reportStep('moon', 'Moon', 'Moon mesh and normal map ready', 'done');
  reportStep('sun', 'Sun', 'Creating sun mesh and glow billboard', 'active');
  const sun = createSun(sunData, setObjectInfos)
  reportStep('sun', 'Sun', 'Sun glow configured from current altitude', 'done');
  const dso = createDSO(getDsoCatalog, setObjectInfos, reportLoading);
  reportStep('grids', 'Coordinate grids', 'Generating equatorial and azimuthal grid overlays', 'active');
  const {eqGrid1, eqGrid2, eqGrid3} = createEquatorialGrid(hex_colors.blue, 1.4);
  const {azGrid1, azGrid2, azGrid3} = createAzimuthalGrid(hex_colors.violet, 1.4);
  reportStep('grids', 'Coordinate grids', 'Grid overlays ready', 'done');

  const light = new THREE.AmbientLight(0xffffff);

  const eqGrid = new THREE.Group();
  const azGrid = new THREE.Group();

  const zenithEq = convertHorizontalToEquatorial(referenceDate.toDate(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 90, az: 0 });
  const northEq = convertHorizontalToEquatorial(referenceDate.toDate(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 0, az: 0 });
  const zenithVec = convertSphericalToCartesian(5, zenithEq.ra, zenithEq.dec);
  const northVec = convertSphericalToCartesian(5, northEq.ra, northEq.dec).normalize();

  azGrid.up.copy(northVec);
  azGrid.lookAt(zenithVec);

  azGrid.add(azGrid1);
  eqGrid.add(eqGrid1);

  azGrid.name = meshGroupsNames.azGrid
  eqGrid.name = meshGroupsNames.eqGrid

  // Default visibility settings
  eqGrid.visible = false;
  azGrid.visible = false;

  const initialEuler = new THREE.Euler().setFromQuaternion(groundTotalQuaternion, 'YXZ');
  setInitialAngles(initialEuler.y, initialEuler.x);

  reportStep('finalize', 'Final assembly', 'Mounting sky objects into the scene graph', 'active');
  scene.add(selectionCircle, eqGrid, azGrid, compassLabels, ground, background, atmosphere, stars, planets, moon, sun, light, dso, constellations, constellationLabels);
  reportStep('finalize', 'Final assembly', 'Scene graph ready for first render', 'done');


  console.log("[GLView] Scene initialized")
  return {
    scene: scene,
    camera: camera,
    renderer: renderer,
    ground: ground,
    atmosphere: atmosphere,
    selectionCircle: selectionCircle,
    grids: {
      eqGrid: eqGrid,
      azGrid: azGrid,
    },
    compassLabels: compassLabels,
    quaternions: {
      groundTotalQuaternion: groundTotalQuaternion,
    }
  }
}
