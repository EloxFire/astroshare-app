import { CalculationCategory } from "../../types/calculations/Calculation";
import { app_colors } from "../variables";

// Ordre d'affichage et couleur de fond des tuiles de résultat sur l'écran "Calculs", par section.
export const CALCULATION_CATEGORIES: { id: CalculationCategory; color: string }[] = [
  { id: "instrument", color: app_colors.accent.light },
  { id: "eyepiece", color: app_colors.yellow.light },
  { id: "photo", color: app_colors.white },
  { id: "general", color: app_colors.green.light },
];
