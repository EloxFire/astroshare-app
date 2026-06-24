import * as THREE from 'three';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Converts equatorial coordinates (RA/Dec in degrees) to a 3D cartesian vector.
 * Convention: X → vernal equinox (RA=0h Dec=0°), Y → RA=6h Dec=0°, Z → NCP (Dec=+90°).
 * This is a right-handed equatorial system compatible with @observerly/astrometry conventions.
 */
export function raDecToVec3(ra_deg: number, dec_deg: number, r = 10): THREE.Vector3 {
  const ra = ra_deg * DEG2RAD;
  const dec = dec_deg * DEG2RAD;
  return new THREE.Vector3(
    r * Math.cos(ra) * Math.cos(dec),
    r * Math.sin(ra) * Math.cos(dec),
    r * Math.sin(dec),
  );
}

/**
 * Converts a unit 3D vector back to (ra, dec) in degrees.
 */
export function vec3ToRaDec(v: THREE.Vector3): { ra: number; dec: number } {
  const norm = v.clone().normalize();
  const dec = Math.asin(Math.max(-1, Math.min(1, norm.z))) * RAD2DEG;
  const ra = ((Math.atan2(norm.y, norm.x) * RAD2DEG) + 360) % 360;
  return { ra, dec };
}

/**
 * Computes the camera "up" vector for a given look direction.
 *
 * When a local zenith vector is supplied (preferred), the up vector keeps the
 * horizon visually horizontal on-screen regardless of where the camera points.
 * Falls back to the NCP when no zenith is available.
 *
 * prevUp (optional): the up vector from the previous frame.  When the look
 * direction is very close to the zenith/nadir the computed up becomes tiny and
 * numerically unstable.  Blending toward the *projected* previous up vector
 * instead of toward a fixed equatorial-plane fallback preserves visual
 * continuity and prevents the camera from suddenly rolling.
 */
export function getCameraUp(
  lookRa: number,
  lookDec: number,
  zenithVec?: THREE.Vector3,
  prevUp?: THREE.Vector3,
): THREE.Vector3 {
  const look = raDecToVec3(lookRa, lookDec, 1).normalize();
  const reference = zenithVec ? zenithVec.clone().normalize() : new THREE.Vector3(0, 0, 1);
  const dot = reference.dot(look);
  const up = reference.clone().sub(look.clone().multiplyScalar(dot));

  // Static equatorial-plane fallback (used when no prevUp is available).
  const ra = lookRa * DEG2RAD;
  const staticFallback = new THREE.Vector3(-Math.sin(ra), Math.cos(ra), 0);

  // Project prevUp perpendicular to the current look direction.
  // If valid, this is a much more stable fallback because it preserves the
  // camera roll from the previous frame rather than snapping to an arbitrary axis.
  const stableFallback = (() => {
    if (!prevUp) return null;
    const d = prevUp.dot(look);
    const perp = prevUp.clone().sub(look.clone().multiplyScalar(d));
    return perp.lengthSq() > 1e-6 ? perp.normalize() : null;
  })();

  const lenSq = up.lengthSq();

  if (lenSq < 1e-6) {
    return stableFallback ?? staticFallback;
  }

  // Blend into the stable fallback as the look direction approaches the
  // zenith/nadir (lenSq → 0, cosSq → 1).  The blend prevents the abrupt
  // camera roll that would occur if we snapped to the static fallback.
  // Threshold: cosSq > 0.997 → angle between look and zenith < ~4°.
  const cosSq = 1 - lenSq;
  if (cosSq > 0.997) {
    const fallback = stableFallback ?? staticFallback;
    const t = (cosSq - 0.997) / 0.003;
    return up.normalize().lerp(fallback, Math.min(1, t)).normalize();
  }

  return up.normalize();
}
