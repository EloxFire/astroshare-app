import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {ExpoWebGLRenderingContext} from "expo-gl";
import {createStars} from "./createStars";
import {Star} from "../../types/Star";
import {createGround} from "./createGround";
import {createBackground} from "./createBackground";
import {GlobalPlanet} from "../../types/GlobalPlanet";
import {createPlanets} from "./createPlanets";
import {EquatorialCoordinate, HorizontalCoordinate} from "@observerly/astrometry";
import {createMoon} from "./createMoon";
import {LocationObject} from "../../types/LocationObject";
import {Quaternion, Vector3} from "three";
import {createDSO} from "./createDSO";
import {drawConstellations} from "../astro/skymap/drawConstellations";
import {createSelectionCircle} from "./createSelectionCircle";

export const initScene = (
  gl: ExpoWebGLRenderingContext,
  currentUserLocation: LocationObject,
  starsCatalog: Star[],
  planetList: GlobalPlanet[],
  moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string }),
): {scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: ExpoTHREE.Renderer, ground: THREE.Mesh, selectionCircle: THREE.Line} => {
  console.log("[GLView] Initializing scene...")

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
  const renderer = new ExpoTHREE.Renderer({gl, antialias: true});

  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x080808);
  camera.position.set(0, 0, 0);

  const selectionCircle = createSelectionCircle()
  const ground = createGround(currentUserLocation)
  const stars = createStars(starsCatalog)
  const planets = createPlanets(planetList)
  const moon = createMoon(moonCoords)
  const background = createBackground()
  const dso = createDSO()
  const constellations = drawConstellations()
  const light = new THREE.AmbientLight(0xffffff);

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

  scene.add(selectionCircle, ground, background, stars, ...planets, moon, light, ...dso, constellations);

  console.log("[GLView] Scene initialized")
  return {
    scene: scene,
    camera: camera,
    renderer: renderer,
    ground: ground,
    selectionCircle: selectionCircle,
  }
}