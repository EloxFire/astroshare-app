import * as THREE from "three";
import { disposeStarsLayer } from "./layers/StarsLayer";
import { disposeDsoLayer } from "./layers/DsoLayer";
import { disposeSolarSystemLayer } from "./layers/SolarSystemLayer";
import type { SceneRefs } from "./SceneBuilder";

// Libère géométrie(s)/matériau(x) GPU d'un mesh — `material` peut être un tableau (THREE.Mesh
// l'autorise), même si aucune couche du planétarium n'en construit pour l'instant.
export const disposeMesh = (mesh: THREE.Mesh): void => {
  mesh.geometry.dispose();
  const material = mesh.material;
  if (Array.isArray(material)) material.forEach((m) => m.dispose());
  else material.dispose();
};

// Groupe de lignes (constellations, grilles) : une géométrie + un matériau PARTAGÉ par enfant (voir
// GridLayer/ConstellationsLayer, un seul THREE.LineBasicMaterial réutilisé pour tous les segments) —
// ne disposer le matériau qu'une fois, pas une fois par enfant.
const disposeLineGroup = (group: THREE.Group): void => {
  let materialDisposed = false;
  group.children.forEach((child) => {
    if (!(child instanceof THREE.Line)) return;
    child.geometry.dispose();
    if (!materialDisposed) {
      const material = child.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material.dispose();
      materialDisposed = true;
    }
  });
};

// À appeler au démontage de l'écran : sans ça, chaque passage sur le planétarium fuit de la mémoire
// GPU (géométries/matériaux/textures du contexte GL précédent jamais libérés).
export const shutdownScene = (refs: SceneRefs): void => {
  disposeStarsLayer(refs.starsCloud);
  disposeDsoLayer(refs.dsoCloud);
  disposeSolarSystemLayer(refs.solarSystem);
  disposeMesh(refs.ground);
  disposeMesh(refs.atmosphere);
  disposeLineGroup(refs.constellationLines);
  disposeLineGroup(refs.eqGrid);
  disposeLineGroup(refs.azGrid);
};
