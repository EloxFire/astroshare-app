import * as THREE from 'three';

/**
 * Convert RA/DEC to a unit vector in Cartesian coordinates
 */
function raDecToCartesian(ra: number, dec: number): THREE.Vector3 {
  const cosDec = Math.cos(dec);
  return new THREE.Vector3(
    Math.cos(ra) * cosDec,
    Math.sin(ra) * cosDec,
    Math.sin(dec)
  ).normalize();
}

/**
 * Orient the camera to look at the given RA/DEC direction.
 * @param ra Right Ascension in radians
 * @param dec Declination in radians
 * @param camera THREE.Camera – must be at position (0, 0, 0)
 */
export function goTo(ra: number, dec: number, camera: THREE.PerspectiveCamera) {
  const target = raDecToCartesian(ra, dec);

  const forward = new THREE.Vector3(0, 0, -1); // camera default direction
  const quaternionStart = camera.quaternion.clone();
  const quaternionOffset = new THREE.Quaternion().setFromUnitVectors(forward, target);

  const quaternionEnd = quaternionOffset.multiply(quaternionStart.clone());

  const duration = 1.0; // seconds
  let elapsed = 0;

  const animate = () => {
    elapsed += 1 / 60;
    const t = Math.min(elapsed / duration, 1);

    camera.quaternion.copy(quaternionStart.clone().slerp(quaternionEnd, t));

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}
