import * as THREE from "three";
import {GestureUpdateEvent, PanGesture, PanGestureHandlerEventPayload} from "react-native-gesture-handler";
import {getEffectiveAngularResolution} from "../../../getEffectiveAngularResolution";

export const handleChangePan = (
  event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  camera: THREE.PerspectiveCamera | null,
  ground: THREE.Mesh | null,
  panGestureHandler: PanGesture | null,
  camWidth: number,
  oldX: number,
  oldY: number,
  azAngle: number,
  altAngle: number
) => {
  if(!camera || !panGestureHandler || !ground) {
    console.log('[pan_gesture_handler] Camera or panGestureHandler or ground is not defined')
    return;
  }

  let q1: THREE.Quaternion = new THREE.Quaternion;
  let q2: THREE.Quaternion = new THREE.Quaternion;
  let q3: THREE.Quaternion = new THREE.Quaternion;
  let newAzAngle = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWidth) * (event.translationX - oldX);
  let Y = new THREE.Vector3(0, 0, 1);
  q1.setFromAxisAngle(Y, newAzAngle);
  let X = new THREE.Vector3(1, 0, 0);
  let newAltAngle = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWidth) * (event.translationY - oldY);
  if (newAltAngle > Math.PI) {
    newAltAngle = Math.PI;
  } else if (newAltAngle < 0) {
    newAltAngle = 0;
  }
  q2.setFromAxisAngle(X, newAltAngle);
  ground.getWorldQuaternion(q3);
  let qtot = q3.multiply(q1).multiply(q2);
  camera.setRotationFromQuaternion(qtot.normalize());

  return {newAzAngle, newAltAngle};
}