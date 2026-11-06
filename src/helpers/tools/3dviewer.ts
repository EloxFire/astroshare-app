import { ImageSourcePropType } from "react-native";
import { DownloadableThreeDModel, ThreeDModel, ThreeDModelCategory } from "../../types/tools/3dViewer";
import { app_colors } from "../variables";

// Illustration utilisée quand un modèle n'a pas la sienne (ThreeDModel.illustration). Centralisée
// ici plutôt que répétée en require() dans chaque composant qui affiche un modèle : évite les
// chemins relatifs fragiles depuis des composants profondément imbriqués (ex: ModelDetails/sections/*).
export const DEFAULT_MODEL_ILLUSTRATION: ImageSourcePropType = require("../../../assets/images/placeholders/3d-viewer.png");

// Chemin local (relatif au dossier documents de l'app) d'un modèle téléchargé. Inclut sa version :
// si elle change côté serveur, le fichier en cache n'a plus le même nom et un nouveau
// téléchargement est déclenché au lieu de réutiliser l'ancien fichier.
export function getModelLocalPath(model: DownloadableThreeDModel): string {
  return `3d-models/${model.id}-v${model.version}.glb`;
}

// TODO : IMPORTANT - Populer cette liste avec les modèles et les informations détaillées
export const threeDModelsCategories: ThreeDModelCategory[] = [
  {
    id: "solarsystem",
    color: app_colors.accent.light
  },
  {
    id: 'space-probes',
    color: app_colors.yellow.light
  },
  {
    id: "satellites",
    color: app_colors.white
  },
  {
    id: "launchers",
    color: app_colors.accent.light
  }
]


export const threeDModelsList: ThreeDModel[] = [
  {
    id: "sun",
    category: "solarsystem",
  },
  {
    id: "earth",
    category: "solarsystem"
  },
  {
    id: "moon",
    category: "solarsystem",
    modelUrl: "https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/Moon_NASA_LRO_8k_Topo_Small.glb",
    version: 1,
    source: { name: "NASA Scientific Visualization Studio", url: "https://svs.gsfc.nasa.gov/4720" },
    // Même décalage que la texture de MoonPhase.tsx (TEXTURE_ROTATION_Y) : cet asset NASA présente
    // sa face attendue vers -X plutôt que vers la caméra (+Z) par défaut.
    rotationY: -Math.PI / 2,
  },
  {
    id: "mars",
    category: "solarsystem"
  },
  {
    id: "voyager-1",
    category: "space-probes"
  },
  {
    id: "ariane-6",
    category: "launchers"
  },
  {
    id: "starlink",
    category: "satellites"
  },
  {
    id: "hubble",
    category: "satellites"
  },
  {
    id: "iss",
    category: "satellites",
    modelUrl: "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/i/ISS_stationary.glb?emrc=6aeb2fc881fb4",
    version: 1,
    source: { name: "NASA", url: "https://science.nasa.gov" },
  }
]

// Une statistique affichée sur la fiche détaillée d'un modèle (section "En chiffres"). Un tableau
// plutôt qu'un schéma fixe {diamètre, distance, ...} : tous les modèles n'ont pas les mêmes
// grandeurs pertinentes (une sonde n'a pas de "gravité"), inutile de forcer des champs vides.
export type ModelStat = {
  // Identifiant stable, indépendant de la clé i18n : sert à brancher une valeur calculée en
  // direct dans le composant (ex: distance réelle du jour) à la place de `value` — voir les
  // stats "en direct" dans ModelDetails.tsx.
  id: string;
  // Valeur statique. Absente si la valeur est calculée dans le composant (voir id ci-dessus) ;
  // ModelDetails.tsx affiche alors la valeur calculée à la place.
  value?: number;
  unit: "km" | "m" | "kmh" | "min" | "days" | "mps2";
  labelKey: string;       // clé i18n (namespace tools/3dviewer), ex: "stats.diameter"
  comparisonKey?: string; // clé i18n optionnelle, ex: "stats.diameterComparison"
}

// Un repère à afficher sur le modèle (section "À repérer sur le modèle"). La position en
// lat/lon (plutôt qu'une coordonnée écran) sert à le localiser réellement sur la sphère 3D une
// fois le rendu interactif en place — pas utilisée pour l'instant, juste le texte.
export type PointOfInterest = {
  id: string; // clé i18n sous pointsOfInterest.<id>.{title,description}
  position: { lat: number; lon: number };
}

export type ModelDetails = {
  tagKeys: string[]; // clés i18n sous tags.<clé>
  stats: ModelStat[];
  hasFunFact?: boolean; // true si funFacts.<id> existe dans tools/3dviewer.json
  pointsOfInterest?: PointOfInterest[];
  relatedModelIds?: string[]; // résolus via threeDModelsList, jamais dupliqués ici
}

// Contenu détaillé des modèles, par id. Les modèles sans entrée ici n'affichent que le strict
// minimum sur leur fiche (titre, sous-titre, tags) : ModelDetails.tsx gère cette absence sans planter.
export const threeDModelsDetails: Record<string, ModelDetails> = {
  moon: {
    tagKeys: ["solarSystem", "nakedEyeVisible"],
    stats: [
      // { id: "diameter", value: 3474, unit: "km", labelKey: "stats.diameter", comparisonKey: "stats.diameterComparison" },
      { id: "diameter", value: 3474, unit: "km", labelKey: "stats.diameter" },
      // Pas de value : la distance Terre-Lune varie au jour le jour (orbite elliptique), calculée
      // en direct dans ModelDetails.tsx plutôt que figée ici sur sa moyenne.
      { id: "distance", unit: "km", labelKey: "stats.distance" },
      { id: "rotation", value: 27.3, unit: "days", labelKey: "stats.rotation" },
      { id: "gravity", value: 1.62, unit: "mps2", labelKey: "stats.gravity" },
    ],
    hasFunFact: true,
    pointsOfInterest: [
      { id: "tranquility", position: { lat: 8.5, lon: 31.4 } },
      { id: "tycho", position: { lat: -43.3, lon: -11.4 } },
      { id: "imbrium", position: { lat: 32.8, lon: -15.6 } },
    ],
    relatedModelIds: ["earth", "sun"],
  },
  iss: {
    tagKeys: ["lowEarthOrbit", "permanentlyInhabited"],
    stats: [
      // TODO : implémenter les valeurs calculées une fois les fonctionnalités de suivi de satellites en place dans l'application
      { id: "length", value: 109, unit: "m", labelKey: "stats.length" },
      { id: "altitude", value: 400, unit: "km", labelKey: "stats.altitude" },
      { id: "speed", value: 27600, unit: "kmh", labelKey: "stats.speed" },
      { id: "orbitalPeriod", value: 93, unit: "min", labelKey: "stats.orbitalPeriod" },
    ],
    hasFunFact: true,
    relatedModelIds: ["hubble", "starlink"],
  },
}