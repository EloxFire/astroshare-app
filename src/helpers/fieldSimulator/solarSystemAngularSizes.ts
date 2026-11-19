// Diamètres apparents de secours pour les objets du système solaire autres que la Lune (calculée
// en direct via @observerly/astrometry, voir objectAngularSize.ts) et le Soleil (non proposé ici —
// jamais d'observation directe à l'oculaire sans filtre dédié).
//
// Pourquoi des valeurs statiques plutôt qu'un calcul en direct : le diamètre apparent d'une planète
// dépend de sa distance réelle à la Terre à l'instant donné, qui suppose de calculer sa position
// géocentrique (différence vectorielle Terre/planète, toutes deux en coordonnées héliocentriques).
// @observerly/astrometry expose la distance héliocentrique de chaque planète
// (getPlanetaryHeliocentricDistance) et sa longitude écliptique, mais pas de distance géocentrique
// toute faite ni de rayon physique en km — construire ce calcul proprement (vecteurs 3D, méthode de
// Meeus) serait un chantier à part entière, pas une simple extension de ce fichier.
//
// En attendant, cette table donne une taille moyenne de référence (diamètre angulaire moyen,
// généralement proche de l'opposition pour les planètes extérieures, ou de la plus grande
// élongation pour les planètes intérieures — valeurs rondes d'usage courant en astronomie amateur,
// pas une mesure). Elle est volontairement incomplète : à enrichir/corriger au fil du temps avec des
// données plus précises si besoin, ou à remplacer entrée par entrée le jour où un calcul en direct
// devient disponible (voir objectAngularSize.ts, qui n'interroge cette table qu'en dernier recours).
//
// Clé : id stable du catalogue (ex: "SS-SATURN", vérifié en direct via /v3/objects?kind=solar_system).
const STATIC_SOLAR_SYSTEM_ANGULAR_DIAMETERS_ARCSEC: Record<string, number> = {
  "SS-MERCURY": 7,     // ~5″ à la conjonction supérieure, ~13″ à l'inférieure — valeur médiane
  "SS-VENUS": 25,      // ~10″ pleine phase, ~66″ en croissant fin — valeur à la plus grande élongation
  "SS-MARS": 9,        // ~4″ en conjonction, jusqu'à ~25″ à une opposition favorable
  "SS-JUPITER": 40,    // ~30″ à la conjonction, ~50″ à l'opposition
  "SS-SATURN": 18,     // disque seul (hors anneaux, qui doublent grossièrement l'extension visuelle)
  "SS-URANUS": 3.5,
  "SS-NEPTUNE": 2.3,
};

export const getStaticSolarSystemAngularDiameter = (objectId: string): number | null => {
  const arcsec = STATIC_SOLAR_SYSTEM_ANGULAR_DIAMETERS_ARCSEC[objectId];
  return arcsec != null ? arcsec / 3600 : null;
};
