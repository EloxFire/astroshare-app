import * as THREE from 'three';
import {getEffectiveAngularResolution} from "../../getEffectiveAngularResolution";

export const handleInertia = (
  camera: THREE.PerspectiveCamera,
  ground: THREE.Mesh,
  camWdth: number,
  azAngle: number,
  altAngle: number,
  Vx: number,
  Vy: number,
  inertiaEnabled: boolean,
) => {
  if (camera) {
    let q1: THREE.Quaternion = new THREE.Quaternion;
    let q2: THREE.Quaternion = new THREE.Quaternion;
    let q3: THREE.Quaternion = new THREE.Quaternion;
    let newAzAngle: number = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vx * 0.01;
    let Y: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    q1.setFromAxisAngle(Y, newAzAngle);
    let X: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    let newAltAngle: number = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vy * 0.01;
    if (newAltAngle > Math.PI) {
      newAltAngle = Math.PI;
    } else if (newAltAngle < 0) {
      newAltAngle = 0;
    }
    q2.setFromAxisAngle(X, newAltAngle);
    ground.getWorldQuaternion(q3);
    let qtot: THREE.Quaternion = q3.multiply(q1).multiply(q2);
    camera.setRotationFromQuaternion(qtot.normalize());
    azAngle = newAzAngle;
    altAngle = newAltAngle;
    Vx = Vx * 0.98;
    Vy = Vy * 0.98;
    if (Math.abs(Vx) < 0.1) {
      Vx = 0;
    }
    if (Math.abs(Vy) < 0.1) {
      Vy = 0;
    }
    if (Vy == 0 && Vx == 0) {
      inertiaEnabled = false;
    }
    camera.updateProjectionMatrix();
    return {azAngle, altAngle, Vx, Vy, inertiaEnabled};
  }
}
