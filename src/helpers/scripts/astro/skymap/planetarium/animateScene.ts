import * as THREE from "three";
import ExpoTHREE from "expo-three";
import {ExpoWebGLRenderingContext} from "expo-gl";

export const animateScene = (gl: ExpoWebGLRenderingContext ,scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: ExpoTHREE.Renderer) => {
  console.log('[Planetarium] Starting scene animation...')
  const animate = () => {
    requestAnimationFrame(animate);

    if(camera && renderer && scene) {
      renderer.render(scene, camera);
      gl.endFrameEXP(); // This is needed for the animation to work with Expo's GL context
    }
  }

  animate();
  console.log('[Planetarium] Scene animation started.')
}