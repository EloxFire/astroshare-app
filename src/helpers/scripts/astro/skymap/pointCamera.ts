import * as THREE from 'three';

export const pointCamera = (camera: THREE.PerspectiveCamera, target: THREE.Vector3, distance: number) => {
  camera.lookAt(target);
}