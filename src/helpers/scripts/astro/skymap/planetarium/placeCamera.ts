import * as THREE from 'three';

export const placeCamera = (camera: THREE.PerspectiveCamera, groundMesh: THREE.Mesh) => {
  let q11 = new THREE.Quaternion;
  let q12 = new THREE.Quaternion;
  let q13 = new THREE.Quaternion;
  let Y1 = new THREE.Vector3(0, 0, 1);
  let X1 = new THREE.Vector3(1, 0, 0);
  q11.setFromAxisAngle(Y1, 0);
  q12.setFromAxisAngle(X1, Math.PI / 2);
  groundMesh.getWorldQuaternion(q13);
  let qtot1 = q13.multiply(q11).multiply(q12);
  camera.setRotationFromQuaternion(qtot1.normalize());
}