import { getConstellationByAbbreviation } from "./getConstellationByAbbreviation";

// Nom complet d'une constellation à partir de son abréviation IAU à 3 lettres (ex: "Ori" → "Orion",
// "UMa" → "Ursa Major") — insensible à la casse, pour accepter aussi bien object.position.const
// (catalogue objets) que l'abréviation renvoyée par getConstellation (@observerly/astrometry).
// null si l'abréviation ne correspond à aucune des 88 constellations IAU (ex: donnée absente ou
// corrompue côté catalogue).
export const getConstellationName = (abbreviation: string): string | null =>
  getConstellationByAbbreviation(abbreviation)?.name ?? null;
