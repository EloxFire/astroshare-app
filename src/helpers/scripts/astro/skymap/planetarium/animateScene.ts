import * as THREE from "three";
import ExpoTHREE from "expo-three";
import {ExpoWebGLRenderingContext} from "expo-gl";
import {handleInertia} from "./gestures/handleInertia";

export const animateScene = (
  gl: ExpoWebGLRenderingContext ,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  ground: THREE.Mesh,
  cameraWidth: number,
  azAngle: number,
  altAngle: number,
  vX: number,
  vY: number,
  renderer: ExpoTHREE.Renderer,
  inertiaEnabled: boolean,
) => {
  console.log('[Planetarium] Starting scene animation...')
  const animate = () => {
    requestAnimationFrame(animate);
    if(inertiaEnabled) {
      handleInertia(camera, ground, cameraWidth, azAngle, altAngle, vX, vY, inertiaEnabled);
    }

    if(camera && renderer && scene) {
      renderer.render(scene, camera);
      gl.endFrameEXP(); // This is needed for the animation to work with Expo's GL context
    }
  }

  animate();
  console.log('[Planetarium] Scene animation started.')
}
