import { constellations, type Constellation, type ConstellationName } from "@observerly/astrometry";

// Le Serpent est coupé en deux morceaux disjoints par Ophiuchus (Serpens Caput/Cauda) : le catalogue
// (object.position.const) les désigne par "Ser1"/"Ser2" (convention IAU courante), mais
// @observerly/astrometry leur donne ses propres abréviations ("SerCap"/"SerCad", vérifié en direct) —
// sans cet alias, une étoile ou un DSO du Serpent ne retrouverait jamais sa constellation.
const ABBREVIATION_ALIASES: Record<string, ConstellationName> = {
  ser1: "Serpens Caput",
  ser2: "Serpens Cauda",
};

// Constellation complète (nom, tracé en MultiLineString...) à partir de son abréviation IAU à 3
// lettres (ex: "Ori", "UMa") — insensible à la casse. `constellations` est indexée par nom complet,
// pas par abréviation : on la parcourt une fois (88 entrées, coût négligeable à l'usage, pas de quoi
// justifier une table inversée précalculée). null si l'abréviation ne correspond à aucune des 88
// constellations IAU (ex: donnée absente ou corrompue côté catalogue).
export const getConstellationByAbbreviation = (abbreviation: string): Constellation | null => {
  const normalized = abbreviation.trim().toLowerCase();

  const aliasedName = ABBREVIATION_ALIASES[normalized];
  if (aliasedName) return constellations.get(aliasedName) ?? null;

  for (const constellation of constellations.values()) {
    if (constellation.abbreviation.toLowerCase() === normalized) return constellation;
  }
  return null;
};
