import { FieldSimulatorCombo } from "./setupCombos";
import { ObjectAngularSize } from "./objectAngularSize";

export type FieldOfView =
  | { shape: "circle"; diameterDegrees: number }
  | { shape: "rect"; widthDegrees: number; heightDegrees: number };

// Mêmes formules que le registre de calculs (src/helpers/calculations/calculations.ts,
// `trueField`/`cameraField`) — reprises ici plutôt qu'importées : ce registre est couplé à l'écran
// Calculs astronomiques (saisie manuelle de valeurs, pas de Setup), pas réutilisable tel quel.
export const getComboMagnification = (combo: FieldSimulatorCombo): number | null =>
  combo.kind === "eyepiece" && combo.scope.focalLength && combo.eyepiece.focalLength
    ? combo.scope.focalLength / combo.eyepiece.focalLength
    : null;

export const getComboFieldOfView = (combo: FieldSimulatorCombo): FieldOfView | null => {
  if (combo.kind === "eyepiece") {
    const magnification = getComboMagnification(combo);
    if (!magnification) return null;
    return { shape: "circle", diameterDegrees: combo.eyepiece.afov / magnification };
  }

  if (!combo.scope.focalLength) return null;
  // Angle exact (arctan), pas l'approximation aux petits angles — même choix que cameraField.
  const widthDegrees = 2 * Math.atan(combo.camera.sensorSize.width / (2 * combo.scope.focalLength)) * (180 / Math.PI);
  const heightDegrees = 2 * Math.atan(combo.camera.sensorSize.height / (2 * combo.scope.focalLength)) * (180 / Math.PI);
  return { shape: "rect", widthDegrees, heightDegrees };
};

export type FieldFitResult = {
  // Rapport taille apparente de l'objet (grand axe) / taille du champ, en % — > 100 veut dire que
  // l'objet déborde du champ visible.
  occupancyPercent: number;
  fits: boolean;
};

// Pour un champ circulaire (oculaire), seul le grand axe compte (un objet plus large que haut peut
// déborder par les côtés sans déborder le diamètre si on comparait par la hauteur). Pour un champ
// rectangulaire (capteur), le grand axe est comparé à la largeur et le petit axe à la hauteur — une
// approximation qui ignore l'angle de position (`positionAngleDegrees`) de l'objet par rapport au
// capteur, pas exploitable ici sans connaître l'orientation physique de la caméra sur le ciel.
export const getFieldFitResult = (fieldOfView: FieldOfView, angularSize: ObjectAngularSize): FieldFitResult => {
  if (fieldOfView.shape === "circle") {
    const occupancyPercent = (angularSize.majorDegrees / fieldOfView.diameterDegrees) * 100;
    return { occupancyPercent, fits: angularSize.majorDegrees <= fieldOfView.diameterDegrees };
  }

  const occupancyPercent = (angularSize.majorDegrees / fieldOfView.widthDegrees) * 100;
  const fits = angularSize.majorDegrees <= fieldOfView.widthDegrees && angularSize.minorDegrees <= fieldOfView.heightDegrees;
  return { occupancyPercent, fits };
};

// "2,32°" si le champ fait au moins 1°, "26′" en dessous — un champ d'oculaire ou de capteur serré
// tombe facilement sous 1°, où l'afficher en degrés donnerait des décimales peu lisibles (ex: "0,43°").
export const formatFieldOfViewValue = (degrees: number, language: string, formatLocaleNumber: (value: number, language: string, decimals?: number) => string): string =>
  degrees >= 1
    ? `${formatLocaleNumber(degrees, language, 2)}°`
    : `${formatLocaleNumber(degrees * 60, language, 0)}′`;

// "1,42° × 1°" (ou "26′ × 18′" sous 1°) : les deux axes dans la même unité, choisie sur le grand
// axe — mélanger degrés et arcminutes sur une même ligne serait illisible.
export const formatAngularSizeLabel = (size: ObjectAngularSize, language: string, formatLocaleNumber: (value: number, language: string, decimals?: number) => string): string => {
  const useArcmin = size.majorDegrees < 1;
  const toUnit = (degrees: number) => useArcmin ? `${formatLocaleNumber(degrees * 60, language, 0)}′` : `${formatLocaleNumber(degrees, language, 2)}°`;
  return `${toUnit(size.majorDegrees)} × ${toUnit(size.minorDegrees)}`;
};
