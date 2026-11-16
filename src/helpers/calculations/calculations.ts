import { CalculationDefinition, CalculationValues } from "../../types/calculations/Calculation";
import { formatLocaleNumber } from "../format";
import { getUsefulMagnificationRange } from "../gear/telescopes";
import MagnificationGaugeVisualization from "../../components/calculations/visualizations/MagnificationGaugeVisualization";
import SamplingGaugeVisualization from "../../components/calculations/visualizations/SamplingGaugeVisualization";
import MoonFieldVisualization from "../../components/calculations/MoonFieldVisualization/MoonFieldVisualization";
import CameraFieldVisualization from "../../components/calculations/CameraFieldVisualization/CameraFieldVisualization";

// Comme formatLocaleNumber, mais retire la décimale si elle est nulle ("7,0" → "7") : les rapports
// (F/D, pupille de sortie...) sont souvent des nombres ronds, qu'afficher avec un ",0" alourdirait.
const formatTrimmed = (value: number, language: string, decimals: number): string => {
  const formatted = formatLocaleNumber(value, language, decimals);
  const decimalChar = language === "it" || language === "fr" ? "," : ".";
  const zeroSuffix = `${decimalChar}${"0".repeat(decimals)}`;
  return formatted.endsWith(zeroSuffix) ? formatted.slice(0, -zeroSuffix.length) : formatted;
};

// Grossissement, le seul calcul dont dépendent d'autres calculs de ce registre (champ réel,
// pupille de sortie) : une fonction ordinaire, pas de graphe de dépendances générique — un calcul
// qui a besoin d'un autre appelle simplement sa fonction `compute`.
export const computeMagnification = (values: CalculationValues): number | null =>
  values.instrumentFocalLength != null && values.eyepieceFocalLength
    ? values.instrumentFocalLength / values.eyepieceFocalLength
    : null;

export const CALCULATIONS: CalculationDefinition[] = [
  {
    id: "focalRatio",
    category: "instrument",
    inputs: ["instrumentFocalLength", "aperture"],
    formulaLatex: "\\(\\dfrac{F}{D} = \\dfrac{\\text{focale}}{\\text{diamètre}}\\)",
    compute: (v) => (v.aperture ? v.instrumentFocalLength / v.aperture : null),
    formatResult: (value, language) => `F/${formatTrimmed(value, language, 1)}`,
  },
  {
    id: "resolvingPower",
    category: "instrument",
    inputs: ["aperture"],
    formulaLatex: "\\(\\theta = \\dfrac{116}{D}\\)",
    // Limite de Dawes (D en mm, résultat en secondes d'arc) : limite théorique de séparation de
    // deux points, en pratique dégradée par la turbulence atmosphérique.
    compute: (v) => (v.aperture ? 116 / v.aperture : null),
    formatResult: (value, language) => `${formatTrimmed(value, language, 2)}″`,
  },
  {
    id: "minMagnification",
    category: "instrument",
    inputs: ["aperture"],
    formulaLatex: "\\(G_{min} = \\dfrac{D}{7}\\)",
    compute: (v) => (v.aperture ? getUsefulMagnificationRange(v.aperture).min : null),
    formatResult: (value, language) => `${formatLocaleNumber(value, language, 0)}×`,
  },
  {
    id: "maxMagnification",
    category: "instrument",
    inputs: ["aperture"],
    formulaLatex: "\\(G_{max} = 2 \\times D\\)",
    compute: (v) => (v.aperture ? getUsefulMagnificationRange(v.aperture).max : null),
    formatResult: (value, language) => `${formatLocaleNumber(value, language, 0)}×`,
  },
  {
    id: "barlowFocalLength",
    category: "instrument",
    inputs: ["instrumentFocalLength", "barlowFactor"],
    formulaLatex: "\\(F' = F \\times k\\)",
    compute: (v) => (v.instrumentFocalLength != null && v.barlowFactor != null ? v.instrumentFocalLength * v.barlowFactor : null),
    formatResult: (value, language) => `${formatLocaleNumber(value, language, 0)} mm`,
  },
  {
    id: "limitingMagnitude",
    category: "instrument",
    inputs: ["aperture"],
    formulaLatex: "\\(m_{lim} = 2{,}7 + 5 \\times \\log_{10}(D)\\)",
    // Formule d'amateur courante (D en mm) : calée sur l'œil nu (pupille ~7mm → ~6,9, proche des
    // ~6,5 habituellement cités) — une estimation, pas une mesure (voir resultNote).
    compute: (v) => (v.aperture > 0 ? 2.7 + 5 * Math.log10(v.aperture) : null),
    formatResult: (value, language) => formatTrimmed(value, language, 1),
  },
  {
    id: "magnification",
    category: "eyepiece",
    // `aperture` n'est pas utilisée par compute() (G = F ÷ f seul suffit), mais la visualisation
    // (plage utile de l'instrument) en a besoin : elle fait partie des entrées de ce calcul.
    inputs: ["instrumentFocalLength", "eyepieceFocalLength", "aperture"],
    formulaLatex: "\\(G = \\dfrac{F}{f}\\)",
    compute: computeMagnification,
    formatResult: (value, language) => `${formatLocaleNumber(value, language, 0)}×`,
    Visualization: MagnificationGaugeVisualization,
  },
  {
    id: "trueField",
    category: "eyepiece",
    inputs: ["apparentField", "instrumentFocalLength", "eyepieceFocalLength"],
    formulaLatex: "\\(C = \\dfrac{\\text{champ apparent}}{G}\\)",
    compute: (v) => {
      const magnification = computeMagnification(v);
      return magnification && v.apparentField != null ? v.apparentField / magnification : null;
    },
    formatResult: (value, language) => `${formatTrimmed(value, language, 2)}°`,
    Visualization: MoonFieldVisualization,
  },
  {
    id: "exitPupil",
    category: "eyepiece",
    inputs: ["aperture", "instrumentFocalLength", "eyepieceFocalLength"],
    formulaLatex: "\\(P = \\dfrac{D}{G}\\)",
    compute: (v) => {
      const magnification = computeMagnification(v);
      return magnification && v.aperture != null ? v.aperture / magnification : null;
    },
    formatResult: (value, language) => `${formatTrimmed(value, language, 1)} mm`,
  },
  {
    id: "sampling",
    category: "photo",
    // `barlowFactor` est facultatif (pas de fiche "barlow/réductrice" dans le matériel) : resté
    // vide, `?? 1` retombe sur la focale de l'instrument seule, comportement inchangé.
    inputs: ["pixelSize", "instrumentFocalLength", "barlowFactor"],
    formulaLatex: "\\(E = \\dfrac{206 \\times p}{F \\times k}\\)",
    compute: (v) => {
      if (!v.instrumentFocalLength || v.pixelSize == null) return null;
      const effectiveFocalLength = v.instrumentFocalLength * (v.barlowFactor ?? 1);
      return (206 * v.pixelSize) / effectiveFocalLength;
    },
    formatResult: (value, language) => `${formatTrimmed(value, language, 2)}″/px`,
    Visualization: SamplingGaugeVisualization,
  },
  {
    id: "cameraField",
    category: "photo",
    // Le champ résultat (compute()) ne porte que sur la largeur, mais `sensorHeight` fait partie
    // des entrées : le capteur est rectangulaire, pas carré, et CameraFieldVisualization en a
    // besoin pour dessiner un cadre au bon rapport largeur/hauteur (voir ce composant).
    inputs: ["sensorWidth", "sensorHeight", "instrumentFocalLength"],
    formulaLatex: "\\(C = 2 \\times \\arctan\\!\\left(\\dfrac{l}{2F}\\right)\\)",
    // Angle exact (arctan), pas l'approximation aux petits angles : à ces focales l'écart est
    // négligeable, mais autant utiliser la formule correcte, pas plus coûteuse à calculer.
    compute: (v) =>
      v.sensorWidth != null && v.instrumentFocalLength
        ? 2 * Math.atan(v.sensorWidth / (2 * v.instrumentFocalLength)) * (180 / Math.PI)
        : null,
    formatResult: (value, language) => `${formatTrimmed(value, language, 2)}°`,
    Visualization: CameraFieldVisualization,
  },
  {
    id: "maxExposureTime",
    category: "photo",
    // Règle NPF : plus précise que la "règle des 500", elle utilise l'ouverture réelle (déduite de
    // F ÷ D, pas besoin de la redemander) et la taille de pixel plutôt qu'un facteur de recadrage.
    inputs: ["aperture", "instrumentFocalLength", "pixelSize"],
    formulaLatex: "\\(t = \\dfrac{35 \\times N + 30 \\times p}{F}\\)",
    compute: (v) => {
      if (!v.aperture || !v.instrumentFocalLength || v.pixelSize == null) return null;
      const focalRatio = v.instrumentFocalLength / v.aperture;
      return (35 * focalRatio + 30 * (v.pixelSize / 1000)) / v.instrumentFocalLength;
    },
    formatResult: (value, language) => `${formatTrimmed(value, language, 1)}s`,
  },
  {
    id: "magnitudeConversion",
    category: "general",
    inputs: ["magnitudeDifference"],
    formulaLatex: "\\(r = 10^{\\Delta m / 2{,}5}\\)",
    compute: (v) => (v.magnitudeDifference != null ? Math.pow(10, v.magnitudeDifference / 2.5) : null),
    formatResult: (value, language) => `×${formatTrimmed(value, language, 2)}`,
  },
];

export const getCalculationById = (id: string): CalculationDefinition | undefined =>
  CALCULATIONS.find((calculation) => calculation.id === id);

export const getCalculationsByCategory = (category: CalculationDefinition["category"]): CalculationDefinition[] =>
  CALCULATIONS.filter((calculation) => calculation.category === category);
