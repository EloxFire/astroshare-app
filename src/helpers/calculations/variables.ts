// Catalogue des variables partagées entre calculs : évite de redéfinir l'unité et le libellé
// d'une même grandeur (ex: "focale de l'instrument") dans chaque calcul qui s'en sert.
export interface CalculationVariableDefinition {
  key: string;
  unit?: string;
}

export const CALCULATION_VARIABLES = {
  aperture: { key: "aperture", unit: "mm" },
  instrumentFocalLength: { key: "instrumentFocalLength", unit: "mm" },
  eyepieceFocalLength: { key: "eyepieceFocalLength", unit: "mm" },
  apparentField: { key: "apparentField", unit: "°" },
  pixelSize: { key: "pixelSize", unit: "µm" },
  sensorWidth: { key: "sensorWidth", unit: "mm" },
  sensorHeight: { key: "sensorHeight", unit: "mm" },
  // Multiplicateur d'une barlow (> 1) ou d'une réductrice de focale (< 1) : sans unité physique.
  barlowFactor: { key: "barlowFactor", unit: "×" },
  magnitudeDifference: { key: "magnitudeDifference", unit: "mag" },
} satisfies Record<string, CalculationVariableDefinition>;

export type CalculationVariableKey = keyof typeof CALCULATION_VARIABLES;
