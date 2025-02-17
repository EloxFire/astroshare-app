import * as THREE from "three";
import { GestureUpdateEvent, PanGesture, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { getEffectiveAngularResolution } from "../../../getEffectiveAngularResolution";

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
  if (!camera || !panGestureHandler || !ground) {
    console.log('[pan_gesture_handler] Camera or panGestureHandler or ground is not defined');
    return;
  }

  // Vérifiez les valeurs initiales
  if (isNaN(azAngle) || isNaN(altAngle) || isNaN(oldX) || isNaN(oldY)) {
    console.error('Initial values contain NaN:', { azAngle, altAngle, oldX, oldY });
    return;
  }

  // Vérifiez les valeurs de l'événement
  if (isNaN(event.translationX) || isNaN(event.translationY)) {
    console.error('Event translation values contain NaN:', { translationX: event.translationX, translationY: event.translationY });
    return;
  }

  let q1 = new THREE.Quaternion();
  let q2 = new THREE.Quaternion();
  let q3 = new THREE.Quaternion();

  console.log('Az angle: ', azAngle, 'Alt angle: ', altAngle);

  // Calcul des nouveaux angles
  let newAzAngle = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWidth) * (event.translationX - oldX);
  let newAltAngle = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWidth) * (event.translationY - oldY);

  // Vérifiez les nouveaux angles
  if (isNaN(newAzAngle) || isNaN(newAltAngle)) {
    console.error('Calculated angles contain NaN:', { newAzAngle, newAltAngle });
    return;
  }

  // Limitez l'angle d'altitude
  newAltAngle = Math.max(0, Math.min(Math.PI, newAltAngle));

  // Créez des quaternions à partir des angles
  let Y = new THREE.Vector3(0, 0, 1);
  q1.setFromAxisAngle(Y, newAzAngle);

  let X = new THREE.Vector3(1, 0, 0);
  q2.setFromAxisAngle(X, newAltAngle);

  // Obtenez le quaternion du sol
  ground.getWorldQuaternion(q3);

  // Vérifiez les quaternions intermédiaires
  if (isNaN(q1.x) || isNaN(q1.y) || isNaN(q1.z) || isNaN(q1.w) ||
    isNaN(q2.x) || isNaN(q2.y) || isNaN(q2.z) || isNaN(q2.w) ||
    isNaN(q3.x) || isNaN(q3.y) || isNaN(q3.z) || isNaN(q3.w)) {
    console.error('Intermediate quaternions contain NaN:', { q1, q2, q3 });
    return;
  }

  // Calcul du quaternion total
  let qtot = q3.clone().multiply(q1).multiply(q2);

  // Vérifiez le quaternion final
  if (isNaN(qtot.x) || isNaN(qtot.y) || isNaN(qtot.z) || isNaN(qtot.w)) {
    console.error('Total quaternion contains NaN:', qtot);
    return;
  }

  // Appliquez la rotation à la caméra
  camera.setRotationFromQuaternion(qtot.normalize());

  return { newAzAngle, newAltAngle };
};
