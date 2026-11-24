import {
  convertEquatorialToHorizontal,
  getAngularSeparation,
  getMidpointEquatorialCoordinate,
  type EquatorialCoordinate,
  type GeographicCoordinate,
  type SphericalCoordinate,
} from "@observerly/astrometry";

// Décision actée avec l'utilisateur (comme pour les transits ISS) : une conjonction avec l'un des
// deux objets trop bas n'est pas proposée — plus difficile à observer, moins fiable
// géométriquement (réfraction). Pas exposé séparément : seul le seuil de séparation est réglable,
// comme demandé.
const MIN_ALTITUDE_DEGREES = 10;

// Les deux corps bougent lentement à l'échelle de l'heure (contrairement à l'ISS, qui traverse le
// Soleil en moins d'une seconde) : un pas bien plus grossier suffit, MAIS doit rester assez fin
// pour qu'un passage de visibilité typique (une nuit, souvent seulement quelques heures pour un
// objet proche du Soleil comme Vénus) contienne plusieurs échantillons — vérifié en direct : un pas
// de 6h ne laissait pour beaucoup de nuits qu'1 à 2 échantillons par passage, insuffisant pour
// repérer quoi que ce soit.
const COARSE_STEP_MS = 60 * 60 * 1000; // 1 h
const MEDIUM_STEP_MS = 30 * 60 * 1000; // 30 min
const FINE_STEP_MS = 2 * 60 * 1000; // 2 min
const MEDIUM_HALF_WINDOW_MS = 3 * 60 * 60 * 1000; // ±3 h autour du minimum grossier
const FINE_HALF_WINDOW_MS = 30 * 60 * 1000; // ±30 min autour du minimum moyen

export type EquatorialResolver = (atDate: Date) => EquatorialCoordinate;

export type Conjunction = {
  midDate: Date;
  separationArcmin: number;
  azimuth: number; // degrés, du point milieu, au moment du rapprochement minimal
  altitude: number;
  midpoint: EquatorialCoordinate;
  objectA: EquatorialCoordinate;
  objectB: EquatorialCoordinate;
};

const toSpherical = (dec: number, ra: number): SphericalCoordinate => ({ θ: dec, φ: ra });

const getSeparationDeg = (a: EquatorialCoordinate, b: EquatorialCoordinate): number =>
  getAngularSeparation(toSpherical(a.dec, a.ra), toSpherical(b.dec, b.ra));

// Un résolveur est "statique" si sa position ne change pas sur une fenêtre large (étoile/DSO à
// position fixe, sans éphéméride) — comparé à deux instants très éloignés plutôt que rapprochés,
// pour ne pas confondre une position fixe avec un corps qui bouge trop lentement pour qu'un petit
// écart de temps le révèle.
const isResolverStatic = (resolver: EquatorialResolver): boolean => {
  const a = resolver(new Date());
  const b = resolver(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000));
  return Math.abs(a.ra - b.ra) < 1e-9 && Math.abs(a.dec - b.dec) < 1e-9;
};

// Si les deux objets sont à position fixe (deux étoiles/DSO, aucune éphéméride), leur séparation ne
// varie jamais : pas la peine de lancer une recherche temporelle, à détecter en amont côté écran
// pour afficher directement cette séparation constante plutôt que de scanner inutilement toute la
// période choisie.
export const isStaticConjunctionPair = (resolverA: EquatorialResolver, resolverB: EquatorialResolver): boolean =>
  isResolverStatic(resolverA) && isResolverStatic(resolverB);

export const getStaticSeparationDeg = (resolverA: EquatorialResolver, resolverB: EquatorialResolver): number =>
  getSeparationDeg(resolverA(new Date()), resolverB(new Date()));

type VisibleSample = { t: number; separationDeg: number };

// Séparation à un instant donné, ou `null` si l'un des deux objets est sous l'altitude minimale —
// la séparation elle-même se calcule directement en équatorial (une rotation équatorial→horizontal
// conserve les angles, inutile de convertir pour la séparation ; seule la visibilité a besoin de
// l'altitude).
const getVisibleSample = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  t: number
): VisibleSample | null => {
  const date = new Date(t);
  const a = resolverA(date);
  const altitudeA = convertEquatorialToHorizontal(date, observer, a).alt;
  if (altitudeA < MIN_ALTITUDE_DEGREES) return null;

  const b = resolverB(date);
  const altitudeB = convertEquatorialToHorizontal(date, observer, b).alt;
  if (altitudeB < MIN_ALTITUDE_DEGREES) return null;

  return { t, separationDeg: getSeparationDeg(a, b) };
};

// Découpe la période en segments contigus (pas grossier) où les deux objets sont visibles en même
// temps — typiquement une fois par nuit, parfois plus long pour un couple d'objets circumpolaires.
const buildVisibleRuns = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  startMs: number,
  endMs: number
): VisibleSample[][] => {
  const runs: VisibleSample[][] = [];
  let current: VisibleSample[] = [];

  for (let t = startMs; t <= endMs; t += COARSE_STEP_MS) {
    const sample = getVisibleSample(resolverA, resolverB, observer, t);
    if (sample) {
      current.push(sample);
    } else if (current.length > 0) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length > 0) runs.push(current);

  return runs;
};

// Affine un rapprochement déjà approximativement repéré (minimum de la série nuit-par-nuit) en deux
// passes successives (moyenne puis fine), même principe que refineSolarTransitAround. `null` si,
// une fois affiné, la séparation réelle dépasse le seuil choisi (le minimum grossier n'est qu'une
// approximation, pas garanti sous le seuil). Exporté : réutilisé tel quel par la fiche détail pour
// retrouver la même conjonction à partir de son horodatage de route, sans rescanner toute la
// période choisie une seconde fois.
export const refineConjunctionAround = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  approximateMs: number,
  maxSeparationDeg: number
): Conjunction | null => {
  let bestMs = approximateMs;
  let bestSeparationDeg = Infinity;

  for (let t = approximateMs - MEDIUM_HALF_WINDOW_MS; t <= approximateMs + MEDIUM_HALF_WINDOW_MS; t += MEDIUM_STEP_MS) {
    const sample = getVisibleSample(resolverA, resolverB, observer, t);
    if (sample && sample.separationDeg < bestSeparationDeg) {
      bestSeparationDeg = sample.separationDeg;
      bestMs = sample.t;
    }
  }

  for (let t = bestMs - FINE_HALF_WINDOW_MS; t <= bestMs + FINE_HALF_WINDOW_MS; t += FINE_STEP_MS) {
    const sample = getVisibleSample(resolverA, resolverB, observer, t);
    if (sample && sample.separationDeg < bestSeparationDeg) {
      bestSeparationDeg = sample.separationDeg;
      bestMs = sample.t;
    }
  }

  if (bestSeparationDeg > maxSeparationDeg) return null;

  const date = new Date(bestMs);
  const objectA = resolverA(date);
  const objectB = resolverB(date);
  const midpoint = getMidpointEquatorialCoordinate(objectA, objectB);
  const midpointHorizontal = convertEquatorialToHorizontal(date, observer, midpoint);

  return {
    midDate: date,
    separationArcmin: bestSeparationDeg * 60,
    azimuth: midpointHorizontal.az,
    altitude: midpointHorizontal.alt,
    midpoint,
    objectA,
    objectB,
  };
};

// Cœur commun, partagé par findConjunctions (fenêtre fermée) et findNextConjunction (arrêt au
// premier trouvé) — même principe général que scanSolarTransits, en deux temps :
//
// 1. Un passage de visibilité (run, voir buildVisibleRuns) donne UN point représentatif (son
//    échantillon de plus faible séparation) — une série "une valeur par nuit", même si un
//    rapprochement réel s'étale sur plusieurs semaines de nuits successives. Vérifié en direct :
//    sans cette étape, Vénus-Saturne sur 3 ans ressortait en ~114 quasi-doublons (une entrée par nuit
//    pendant tout le rapprochement) plutôt qu'un seul résultat par évènement réel.
// 2. Minima locaux de CETTE série (pas des échantillons bruts) : un seul candidat par rapprochement,
//    affiné ensuite avec une fenêtre resserrée (±3h puis ±30min) — inutile d'élargir cette fenêtre
//    (testé : un élargissement à plusieurs jours résout aussi le problème des doublons mais rend le
//    calcul ~25× plus lent pour un résultat équivalent).
const scanConjunctions = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  startMs: number,
  endMs: number,
  maxSeparationDeg: number,
  stopAtFirst: boolean
): Conjunction[] => {
  const runs = buildVisibleRuns(resolverA, resolverB, observer, startMs, endMs);
  const perRunBest = runs.map((run) => run.reduce((best, sample) => (sample.separationDeg < best.separationDeg ? sample : best)));

  const results: Conjunction[] = [];

  for (let i = 0; i < perRunBest.length; i++) {
    const previous = perRunBest[i - 1];
    const current = perRunBest[i];
    const next = perRunBest[i + 1];
    // Minimum local de la série (un bord de la période choisie compte aussi comme un minimum,
    // faute de voisin de l'autre côté — le mieux qu'on puisse trouver dans la fenêtre demandée).
    const isLocalMinimum = (!previous || current.separationDeg <= previous.separationDeg) && (!next || current.separationDeg <= next.separationDeg);
    if (!isLocalMinimum) continue;

    const conjunction = refineConjunctionAround(resolverA, resolverB, observer, current.t, maxSeparationDeg);
    if (conjunction) {
      results.push(conjunction);
      if (stopAtFirst) return results;
    }
  }

  return results;
};

// Recherche complète sur la période choisie par l'utilisateur (dates de début/fin).
export const findConjunctions = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  { startDate, endDate, maxSeparationDeg }: { startDate: Date; endDate: Date; maxSeparationDeg: number }
): Conjunction[] => scanConjunctions(resolverA, resolverB, observer, startDate.getTime(), endDate.getTime(), maxSeparationDeg, false);

// Recherche de la toute prochaine conjonction, sans borne choisie par l'utilisateur — fenêtre
// généreuse (voir l'écran, qui passe maxDays) mais bon marché : un pas d'1h sur plusieurs années
// reste un calcul de quelques secondes (vérifié en direct : ~3,5 s pour 3 ans), contrairement au
// balayage à la seconde des transits ISS.
export const findNextConjunction = (
  resolverA: EquatorialResolver,
  resolverB: EquatorialResolver,
  observer: GeographicCoordinate,
  { fromDate = new Date(), maxDays, maxSeparationDeg }: { fromDate?: Date; maxDays: number; maxSeparationDeg: number }
): Conjunction | null => {
  const results = scanConjunctions(
    resolverA,
    resolverB,
    observer,
    fromDate.getTime(),
    fromDate.getTime() + maxDays * 24 * 60 * 60 * 1000,
    maxSeparationDeg,
    true
  );
  return results[0] ?? null;
};
