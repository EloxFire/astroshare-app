// Ordre de rendu (THREE.Object3D.renderOrder) et noms (Object3D.name, pour scene.getObjectByName) —
// un seul endroit pour les deux, complété phase après phase (voir le plan du planétarium).
export const RENDER_ORDER = {
  atmosphere: -30,
  solarSystem: -25,
  dso: -21,
  stars: -20,
  azGrid: -10,
  eqGrid: -9,
  constellations: -5,
  ground: 11,
} as const;

export const LAYER_NAMES = {
  stars: "stars",
  dso: "dso",
  solarSystem: "solarSystem",
  ground: "ground",
  atmosphere: "atmosphere",
  constellations: "constellations",
  eqGrid: "eqGrid",
  azGrid: "azGrid",
} as const;
