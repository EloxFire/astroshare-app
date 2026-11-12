import { Telescope, TelescopeUsage } from "../../types/gear/Telescope";

// Types proposés à la sélection dans le formulaire d'ajout (le mockup n'en montre que 4) : le
// Dobson existe dans le type `Telescope` mais seulement pour des fiches déjà existantes, pas pour
// une nouvelle fiche créée depuis ce formulaire.
export const SELECTABLE_TELESCOPE_TYPES: Telescope["type"][] = ["refractor", "reflector", "catadioptric", "other"];

export const TELESCOPE_USAGES: TelescopeUsage[] = ["visual", "planetary", "deepSky", "photo"];

export type FocalRatioProfile = "fast" | "versatile" | "planetary";

// Seuils classiques d'optique amateur pour qualifier un rapport F/D : en dessous de f/6, l'instrument
// est "rapide" (grand champ, ciel profond) ; au-dessus de f/9, il est plutôt dédié planétaire/lunaire
// (champ étroit, fort grossissement natif) ; entre les deux, polyvalent.
export const getFocalRatioProfile = (focalRatio: number): FocalRatioProfile => {
  if (focalRatio < 6) return "fast";
  if (focalRatio <= 9) return "versatile";
  return "planetary";
};

// Grossissement utile mini/maxi à partir du diamètre (mm) : le mini correspond à une pupille de
// sortie de 7mm (diamètre max de la pupille humaine adaptée à l'obscurité, au-delà l'image ne
// s'éclaircit plus) ; le maxi est la limite théorique usuelle de 2x le diamètre en mm, au-delà de
// laquelle l'image perd en piqué et en luminosité sans apporter de détail supplémentaire.
export const getUsefulMagnificationRange = (apertureMm: number): { min: number; max: number } => ({
  min: Math.round(apertureMm / 7),
  max: apertureMm * 2,
});
