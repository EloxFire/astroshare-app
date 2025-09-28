import * as THREE from 'three';

/**
 * Détruit proprement tous les objets d'une scène Three.js (planétarium)
 */
export function shutdownPlanetarium(scene: THREE.Scene) {
  console.log('[Planetarium] Shutting down planetarium...');

  const disposeObject = (object: THREE.Object3D) => {
    // Supprimer les enfants récursivement
    while (object.children.length > 0) {
      const child = object.children[0];
      disposeObject(child);
      object.remove(child);
    }

    // Libérer la géométrie
    if ((object as any).geometry) {
      (object as any).geometry.dispose();
    }

    // Libérer le matériau
    if ((object as any).material) {
      const material = (object as any).material;
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose());
      } else {
        material.dispose();
      }
    }

    // Libérer les textures
    if ((object as any).material?.map) {
      (object as any).material.map.dispose();
    }
  };

  // Parcours de tous les objets de la scène
  scene.traverse((object) => {
    disposeObject(object);
  });

  // Supprimer tous les enfants de la scène
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  console.log('[Planetarium] Scene cleaned and shutdown complete.');
}
