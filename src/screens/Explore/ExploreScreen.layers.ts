// Bascules de couches (phase 7 du plan) — un seul endroit pour la forme des données, partagé entre
// ExploreScreen (état + écriture sur les objets three.js) et LayerSettingsPanel (lecture/UI).
export type LayerVisibility = {
  constellations: boolean;
  eqGrid: boolean;
  azGrid: boolean;
  ground: boolean;
  atmosphere: boolean;
};

// Grilles masquées par défaut (comme à la construction de la scène, voir GridLayer) : utiles pour
// s'orienter mais chargent vite l'écran si elles sont visibles d'emblée. Constellations/sol/
// atmosphère visibles par défaut (repères de base attendus dès l'ouverture).
export const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  constellations: true,
  eqGrid: false,
  azGrid: false,
  ground: true,
  atmosphere: true,
};
