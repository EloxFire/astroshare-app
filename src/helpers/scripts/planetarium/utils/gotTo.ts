import * as THREE from "three";
import { altAngle, azAngle } from "../handlePanGesture";

export function goTo(
  raDeg: number | undefined,
  decDeg: number | undefined,
  camera: THREE.PerspectiveCamera,
  ground: THREE.Mesh,
  updateAngles: (az: number, alt: number) => void
) {
  if (raDeg === undefined || decDeg === undefined) {
    console.warn("[goTo] RA or Dec is undefined, cannot move camera.");
    return;
  }

  const baseQ = ground.userData.baseQuaternion as THREE.Quaternion | undefined;
  if (!baseQ) {
    console.warn("[goTo] Missing baseQuaternion on ground, cannot orient camera.");
    return;
  }

  // Convertir RA/Dec (degrés) en vecteur équatorial unitaire
  const targetEquatorial = raDecToCartesian(raDeg, decDeg);

  // Amener ce vecteur dans le référentiel local (avant rotations az/alt)
  const targetLocal = targetEquatorial.clone().applyQuaternion(baseQ.clone().invert()).normalize();

  // Résoudre les angles avec le même référentiel que handlePanGesture
  // Après rotations : x = -sinAlt * sinAz ; y = sinAlt * cosAz ; z = -cosAlt
  const targetAlt = Math.acos(Math.min(1, Math.max(-1, -targetLocal.z)));
  const sinAlt = Math.sin(targetAlt);
  const targetAz = sinAlt < 1e-6 ? 0 : Math.atan2(-targetLocal.x, targetLocal.y);

  animateToPosition(targetAz, targetAlt, camera, ground, updateAngles);
}

function animateToPosition(
  targetAz: number,
  targetAlt: number,
  camera: THREE.PerspectiveCamera,
  ground: THREE.Mesh,
  updateAngles: (az: number, alt: number) => void
) {
  const steps = 60;
  let step = 0;

  // Normaliser les angles actuels et cibles
  const currentAz = normalizeAngle(azAngle);
  const currentAlt = Math.max(0, Math.min(Math.PI, altAngle));
  const normalizedTargetAz = normalizeAngle(targetAz);
  const clampedTargetAlt = Math.max(0, Math.min(Math.PI, targetAlt));

  // Calculer le chemin le plus court pour l'azimut
  let deltaAz = normalizedTargetAz - currentAz;
  if (deltaAz > Math.PI) {
    deltaAz -= 2 * Math.PI;
  } else if (deltaAz < -Math.PI) {
    deltaAz += 2 * Math.PI;
  }

  const deltaAlt = clampedTargetAlt - currentAlt;

  console.log("[goTo] Animation from Az:", currentAz, "Alt:", currentAlt);
  console.log("[goTo] Animation to Az:", normalizedTargetAz, "Alt:", clampedTargetAlt);
  console.log("[goTo] Delta Az:", deltaAz, "Delta Alt:", deltaAlt);

  function animate() {
    step++;
    const t = step / steps;
    const easeT = 0.5 - 0.5 * Math.cos(Math.PI * t);

    const newAz = currentAz + deltaAz * easeT;
    const newAlt = currentAlt + deltaAlt * easeT;

    // Appliquer la rotation comme dans handlePanGesture
    const q1 = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();

    const Y = new THREE.Vector3(0, 0, 1);
    const X = new THREE.Vector3(1, 0, 0);

    q1.setFromAxisAngle(Y, newAz);
    q2.setFromAxisAngle(X, newAlt);

    const baseQ = ground.userData.baseQuaternion as THREE.Quaternion;
    const finalQ = baseQ.clone().multiply(q1).multiply(q2);

    camera.setRotationFromQuaternion(finalQ.normalize());
    camera.updateProjectionMatrix();

    updateAngles(newAz, newAlt);

    if (step < steps) {
      requestAnimationFrame(animate);
    } else {
      console.log("[goTo] Animation completed at Az:", newAz, "Alt:", newAlt);

      // Debug: vérifier où regarde la caméra maintenant
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      console.log("[goTo] Final camera direction:", cameraDirection.toArray());
    }
  }

  animate();
}

function normalizeAngle(angle: number): number {
  let normalized = angle % (2 * Math.PI);
  if (normalized > Math.PI) {
    normalized -= 2 * Math.PI;
  } else if (normalized < -Math.PI) {
    normalized += 2 * Math.PI;
  }
  return normalized;
}

function raDecToCartesian(raDeg: number, decDeg: number): THREE.Vector3 {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);
  const cosDec = Math.cos(dec);

  return new THREE.Vector3(
    Math.cos(ra) * cosDec,
    Math.sin(ra) * cosDec,
    Math.sin(dec)
  ).normalize();
}

// Fonction de debug pour comprendre le problème
export function debugCurrentView(camera: THREE.PerspectiveCamera, ground: THREE.Mesh) {
  console.log("[Debug] Current azAngle:", azAngle, "altAngle:", altAngle);

  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  console.log("[Debug] Camera direction:", cameraDirection.toArray());

  // Transformer la direction de la caméra vers le référentiel équatorial
  const baseQ = ground.userData.baseQuaternion as THREE.Quaternion;
  const invBaseQ = baseQ.clone().invert();
  const equatorialDirection = cameraDirection.clone().applyQuaternion(invBaseQ);

  console.log("[Debug] Equatorial direction:", equatorialDirection.toArray());

  // Calculer RA/Dec de la direction actuelle
  const currentRA = Math.atan2(equatorialDirection.y, equatorialDirection.x);
  const currentDec = Math.asin(equatorialDirection.z);

  console.log("[Debug] Current RA:", currentRA, "Dec:", currentDec);

  return { ra: currentRA, dec: currentDec };
}
