import * as THREE from 'three';
import { setInitialAngles } from '../handlePanGesture';

/**
 * Centre la caméra vers un objet 3D en scène (planète, étoile, DSO, etc.)
 *
 * @param cameraRef - Référence vers la caméra
 * @param groundRef - Référence vers le sol
 * @param target - Vecteur position cible dans la scène
 */
export function centerCameraToObject3D(
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  groundRef: React.MutableRefObject<THREE.Mesh | null>,
  target: THREE.Vector3
): void {
  const camera = cameraRef.current;
  const ground = groundRef.current;
  if (!camera || !ground) return;

  const baseQuaternion = ground.userData.baseQuaternion as THREE.Quaternion;

  // La direction du point dans le repère de la caméra (après rotation du sol)
  const localTarget = target.clone().applyQuaternion(baseQuaternion);

  // Calcul azimuth (rotation horizontale autour de Z)
  const az = Math.atan2(localTarget.x, localTarget.z);

  // Calcul altitude (élévation verticale)
  const alt = Math.acos(localTarget.y / localTarget.length());

  // Enregistrer ces angles dans le système PanGesture
  setInitialAngles(az, alt);

  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), az);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), alt);
  const qTot = baseQuaternion.clone().multiply(q1).multiply(q2);

  camera.setRotationFromQuaternion(qTot.normalize());
}
