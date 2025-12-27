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
import {getGlobePosition} from "./utils/getGlobePosition";
import {hex_colors} from "../../constants";
import {meshGroupsNames} from "./utils/planetariumSettings";
import {createSun} from "./createSun";
import {ComputedSunInfos} from "../../types/objects/ComputedSunInfos";
import {DSO} from "../../types/DSO";

export const initScene = (
  gl: ExpoWebGLRenderingContext,
  currentUserLocation: LocationObject,
  starsCatalog: Star[],
  planetList: GlobalPlanet[],
  moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string }),
  getDsoCatalog: () => DSO[],
  sunData: ComputedSunInfos,
  setObjectInfos: React.Dispatch<any>,
  currentLocale: string,
  observer: GeographicCoordinate
): {
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
  quaternions: {
    groundTotalQuaternion: Quaternion,
  }
} => {
  console.log("[GLView] Initializing scene...")

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
  const renderer = new ExpoTHREE.Renderer({gl, antialias: true});

  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x080808);
  camera.position.set(0, 0, 0);

  const axesHelper = new THREE.AxesHelper( 3 );
  scene.add( axesHelper );

  const background = createBackground()
  const ground = createGround(currentUserLocation)
  const atmosphere = createAtmosphere();
  const constellations = drawConstellations()
  const selectionCircle = createSelectionCircle()

  // Camera position locked to the ground
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

  const stars = createStars(starsCatalog, setObjectInfos)
  const planets = createPlanets(planetList, setObjectInfos)
  const moon = createMoon(moonCoords, setObjectInfos)
  const sun = createSun(sunData, setObjectInfos)
  const dso = createDSO(getDsoCatalog, setObjectInfos);
  const {eqGrid1, eqGrid2, eqGrid3} = createEquatorialGrid(hex_colors.blue, .5);
  const {azGrid1, azGrid2, azGrid3} = createAzimuthalGrid(hex_colors.violet, .5);

  const light = new THREE.AmbientLight(0xffffff);

  const eqGrid = new THREE.Group();
  const azGrid = new THREE.Group();

  azGrid.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon))

  azGrid.add(azGrid1);
  eqGrid.add(eqGrid1);

  azGrid.name = meshGroupsNames.azGrid
  eqGrid.name = meshGroupsNames.eqGrid

  // Default visibility settings
  eqGrid.visible = false;
  azGrid.visible = false;

  const initialEuler = new THREE.Euler().setFromQuaternion(groundTotalQuaternion, 'YXZ');
  setInitialAngles(initialEuler.y, initialEuler.x);

  scene.add(selectionCircle, eqGrid, azGrid, ground, background, atmosphere, stars, planets, moon, sun, light, dso, constellations);


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
    quaternions: {
      groundTotalQuaternion: groundTotalQuaternion,
    }
  }
}
