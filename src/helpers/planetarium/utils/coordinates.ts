import * as THREE from "three";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// Convention équatoriale (même repère que @observerly/astrometry) : X → point vernal (RA=0h,
// Dec=0°), Y → RA=6h Dec=0°, Z → pôle céleste nord (Dec=+90°) — système droit.
export const raDecToVec3 = (raDeg: number, decDeg: number, r = 10): THREE.Vector3 => {
  const ra = raDeg * DEG2RAD;
  const dec = decDeg * DEG2RAD;
  return new THREE.Vector3(r * Math.cos(ra) * Math.cos(dec), r * Math.sin(ra) * Math.cos(dec), r * Math.sin(dec));
};

export const vec3ToRaDec = (v: THREE.Vector3): { ra: number; dec: number } => {
  const norm = v.clone().normalize();
  const dec = Math.asin(Math.max(-1, Math.min(1, norm.z))) * RAD2DEG;
  const ra = ((Math.atan2(norm.y, norm.x) * RAD2DEG) + 360) % 360;
  return { ra, dec };
};

// Vecteur "haut" de la caméra pour une direction de visée donnée : avec un zénith local fourni
// (cas normal), l'horizon reste visuellement horizontal quelle que soit la direction regardée —
// sans zénith, replie sur le pôle céleste nord. `prevUp` (optionnel, up de la frame précédente) sert
// de repli STABLE près du zénith/nadir : à cet endroit le calcul direct devient numériquement
// instable (vecteur quasi nul) et repartir du up précédent (plutôt que d'un axe arbitraire) évite un
// décrochage brutal de la caméra (roulis qui saute).
export const getCameraUp = (
  lookRa: number,
  lookDec: number,
  zenithVec?: THREE.Vector3,
  prevUp?: THREE.Vector3
): THREE.Vector3 => {
  const look = raDecToVec3(lookRa, lookDec, 1).normalize();
  const reference = zenithVec ? zenithVec.clone().normalize() : new THREE.Vector3(0, 0, 1);
  const dot = reference.dot(look);
  const up = reference.clone().sub(look.clone().multiplyScalar(dot));

  const ra = lookRa * DEG2RAD;
  const staticFallback = new THREE.Vector3(-Math.sin(ra), Math.cos(ra), 0);

  const stableFallback = (() => {
    if (!prevUp) return null;
    const d = prevUp.dot(look);
    const perp = prevUp.clone().sub(look.clone().multiplyScalar(d));
    return perp.lengthSq() > 1e-6 ? perp.normalize() : null;
  })();

  const lenSq = up.lengthSq();
  if (lenSq < 1e-6) return stableFallback ?? staticFallback;

  // Transition en douceur vers le repli stable à l'approche du zénith/nadir (cosSq → 1 = look
  // proche du zénith) plutôt qu'un saut net : seuil à ~4° du zénith (cosSq > 0.997).
  const cosSq = 1 - lenSq;
  if (cosSq > 0.997) {
    const fallback = stableFallback ?? staticFallback;
    const t = (cosSq - 0.997) / 0.003;
    return up.normalize().lerp(fallback, Math.min(1, t)).normalize();
  }

  return up.normalize();
};
