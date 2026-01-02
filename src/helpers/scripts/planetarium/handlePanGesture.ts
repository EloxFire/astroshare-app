import * as THREE from "three";
import {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload
} from "react-native-gesture-handler";
import {getEffectiveAngularResolution} from "./utils/getEffectiveAngularResolution";
import {Quaternion} from "three";

// Variables partagées (tu peux aussi envisager un système de classe ou d’état si besoin)
let oldX = 0;
let oldY = 0;
export let vX = 0;
export let vY = 0;
export let azAngle = 0;
export let altAngle = 0;
export let inertiaEnabled = false;

export const handlePanStart = (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
  console.log("[GLView] Pan gesture started");
  inertiaEnabled = false;
  oldX = 0;
  oldY = 0;
  vX = 0;
  vY = 0;
}

export const handlePanChange = (
  event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  groundRef: React.MutableRefObject<THREE.Mesh | null>,
  cameraWidth: number
) => {
  // console.log("[GLView] Pan gesture changed");
  const camera = cameraRef.current;
  const ground = groundRef.current!;

  if (!camera) {
    console.log("camera is undefined");
    return;
  }

  const q1 = new THREE.Quaternion();
  const q2 = new THREE.Quaternion();
  const q3 = new THREE.Quaternion();

  const Y = new THREE.Vector3(0, 0, 1);
  const X = new THREE.Vector3(1, 0, 0);

  let newAzAngle = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (event.translationX - oldX);
  q1.setFromAxisAngle(Y, newAzAngle);

  let newAltAngle = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (event.translationY - oldY);
  newAltAngle = Math.max(0, Math.min(Math.PI, newAltAngle));
  q2.setFromAxisAngle(X, newAltAngle);

  const baseQ = ground.userData.baseQuaternion as THREE.Quaternion;
  ground.getWorldQuaternion(q3);
  const qtot: Quaternion = baseQ.clone().multiply(q1).multiply(q2);

  camera.setRotationFromQuaternion(qtot.normalize());
  azAngle = newAzAngle;
  altAngle = newAltAngle;

  oldX = event.translationX;
  oldY = event.translationY;
  vX = event.velocityX;
  vY = event.velocityY;

  camera.updateProjectionMatrix();
}

export const handlePanEnd = (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
  console.log("[GLView] Pan gesture ended");
  inertiaEnabled = true;
}


export const applyInertia = (cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>, groundRef: React.MutableRefObject<THREE.Mesh | null>, camWdth: number) => {
  const camera = cameraRef.current!;
  const ground = groundRef.current!;
  if (!camera) return;

  const safeWidth = camWdth || 1;
  const fov = camera.getEffectiveFOV();
  const fovScale = Math.max(0.35, Math.min(1, fov / 90)); // keep some speed when zoomed-in while damping extreme close-ups

  const q1 = new THREE.Quaternion();
  const q2 = new THREE.Quaternion();

  const Y = new THREE.Vector3(0, 0, 1);
  const X = new THREE.Vector3(1, 0, 0);

  let newAzAngle = azAngle + getEffectiveAngularResolution(fov, safeWidth) * vX * 0.01 * fovScale;
  q1.setFromAxisAngle(Y, newAzAngle);

  let newAltAngle = altAngle + getEffectiveAngularResolution(fov, safeWidth) * vY * 0.01 * fovScale;
  newAltAngle = Math.max(0, Math.min(Math.PI, newAltAngle));
  q2.setFromAxisAngle(X, newAltAngle);

  const baseQ = ground.userData.baseQuaternion as THREE.Quaternion;

  const qtot = baseQ.clone().multiply(q1).multiply(q2);
  camera.setRotationFromQuaternion(qtot.normalize());
  azAngle = newAzAngle;
  altAngle = newAltAngle;

  vX *= 0.98;
  vY *= 0.98;

  if (Math.abs(vX) < 0.1) vX = 0;
  if (Math.abs(vY) < 0.1) vY = 0;

  if (vX === 0 && vY === 0) {
    inertiaEnabled = false;
  }

  camera.updateProjectionMatrix();
};

export function setInitialAngles(az: number, alt: number) {
  azAngle = az;
  altAngle = alt;
}
