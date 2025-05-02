import * as THREE from 'three';

/**
 * Crée une ellipse (LineLoop) entourant un rectangle défini par 4 coins 3D.
 * @param corners Tableau de 4 vecteurs représentant les coins du DSO dans l’espace 3D.
 * @returns Une LineLoop représentant l’ellipse.
 */
export function createEllipseFromCorners(corners: THREE.Vector3[]): THREE.LineLoop {
  if (corners.length !== 4) {
    throw new Error('createEllipseFromCorners requires exactly 4 corners');
  }

  // Calcul du centre
  const center = new THREE.Vector3();
  corners.forEach(c => center.add(c));
  center.divideScalar(4);

  // Axes principal (horizontal) et secondaire (vertical)
  const axisA = corners[0].clone().sub(corners[1]); // ex : coin haut gauche - haut droit
  const axisB = corners[0].clone().sub(corners[3]); // ex : coin haut gauche - bas gauche

  const radiusA = axisA.length() / 2;
  const radiusB = axisB.length() / 2;

  const dirA = axisA.normalize();
  const dirB = axisB.normalize();

  const ellipsePoints: THREE.Vector3[] = [];
  const segments = 64;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radiusA;
    const y = Math.sin(theta) * radiusB;

    const point = new THREE.Vector3()
      .addScaledVector(dirA, x)
      .addScaledVector(dirB, y)
      .add(center);

    ellipsePoints.push(point);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });

  return new THREE.LineLoop(geometry, material);
}