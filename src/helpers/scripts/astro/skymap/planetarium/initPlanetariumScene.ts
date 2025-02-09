import * as THREE from "three";
import ExpoTHREE from "expo-three";
import {ExpoWebGLRenderingContext} from "expo-gl";

/*
@summary
This function initializes the scene of the 3D planetarium.
It takes the ExpoWebGLRenderingContext, the width and height of the scene as parameters.
It returns the scene, camera and renderer.

@param {ExpoWebGLRenderingContext} glView: The ExpoWebGLRenderingContext
@param {number} sceneWidth: The width of the scene
@param {number} sceneHeight: The height of the scene
@return {Object} { scene, camera, renderer }
 */
export const initPlanetariumScene = (glView: ExpoWebGLRenderingContext, sceneWidth: number, sceneHeight: number) => {
  console.log('[Planetarium] Initializing scene...')
  const aspect: number = sceneWidth / sceneHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(120, aspect, 0.1, 10000);
  const renderer = new ExpoTHREE.Renderer({ gl: glView });

  const light = new THREE.AmbientLight(0xffffff); // soft white light

  renderer.setSize(sceneWidth, sceneHeight);
  renderer.setClearColor(0x080808);
  scene.add(light);

  camera.position.set(0, 0, 0);

  return { scene, camera, renderer }
}