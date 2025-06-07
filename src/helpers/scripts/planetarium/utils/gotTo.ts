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
  targetWorld: THREE.Vector3
): void {
  const camera = cameraRef.current;
  const ground = groundRef.current;
  if (!camera || !ground) return;

  const baseQuaternion = ground.userData.baseQuaternion as THREE.Quaternion;

  // 👉 Passer dans le repère de la caméra : on annule baseQuaternion
  const invBaseQ = baseQuaternion.clone().invert();
  const target = targetWorld.clone().applyQuaternion(invBaseQ);

  // Calcul des angles dans le repère local
  const az = Math.atan2(target.x, target.z);
  const alt = Math.acos(target.y / target.length());

  // Mettre à jour les angles du système de pan gesture
  setInitialAngles(az, alt);

  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), az);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), alt);
  const finalQ = baseQuaternion.clone().multiply(q1).multiply(q2);

  camera.setRotationFromQuaternion(finalQ.normalize());
}
