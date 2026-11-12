import { Setup } from "../../types/gear/Setup";

// Nombre d'emplacements de matériel effectivement remplis (0 à 8) — même décompte utilisé par
// AddSetup (pour l'aperçu en temps réel pendant la composition) et SetupDetails/Gear (pour
// l'affichage d'un setup déjà enregistré).
export const getSetupPieceCount = (setup: Setup): number =>
  (setup.scope ? 1 : 0)
  + (setup.mount ? 1 : 0)
  + setup.eyepieces.length
  + setup.filters.length
  + setup.cameras.length
  + (setup.guideScope ? 1 : 0)
  + (setup.guideCamera ? 1 : 0)
  + setup.focusers.length
