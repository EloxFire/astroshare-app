import {
  convertEquatorialToHorizontal,
  getAngularSeparation,
  getSolarAngularDiameter,
  getSolarEquatorialCoordinate,
  type GeographicCoordinate,
  type SphericalCoordinate,
} from "@observerly/astrometry";
import { getTopocentricPosition, type SatrecHandle, type TopocentricPosition } from "./propagation";

// Dimension physique représentative de l'ISS (sa plus grande longueur, le long de sa structure en
// treillis) — aucune donnée de taille réelle n'existe dans le catalogue satellite de l'app
// (vérifié), approximation courante pour ce genre de calcul (même simplification que les
// calculateurs de transit grand public, voir transit-finder.com).
const ISS_PHYSICAL_SIZE_METERS = 109;

// Décision actée avec l'utilisateur : un transit avec le Soleil (donc l'ISS) trop bas n'est pas
// proposé du tout — plus difficile à observer et moins fiable géométriquement (réfraction).
const MIN_ALTITUDE_DEGREES = 10;

// Étape 1+2 (recherche grossière) : un pas large sur toute la fenêtre choisie par l'utilisateur
// (jusqu'à 14 jours), juste pour repérer les rares fenêtres "ISS ET Soleil au-dessus du seuil" —
// pas la peine d'une résolution fine ici, une fenêtre de jour dure plusieurs minutes.
const COARSE_STEP_MS = 60_000;
// Étape 3 : à l'intérieur d'une fenêtre de jour, repère la région de plus faible séparation.
// N'a pas besoin de tomber pile sur le minimum réel (l'affinage de l'étape 4 s'en charge) : juste
// d'amener l'échantillon le plus proche à quelques centaines de ms du vrai minimum, largement
// suffisant pour tomber dans la fenêtre d'affinage de ±FINE_HALF_WINDOW_MS ci-dessous.
const MEDIUM_STEP_MS = 500;
// Étape 4 : l'ISS traverse le Soleil en bien moins d'une seconde généralement — affinage
// nécessairement fin, mais seulement sur quelques secondes autour du minimum grossier.
const FINE_STEP_MS = 20;
const FINE_HALF_WINDOW_MS = 4_000;

// Marge large avant de déclencher l'affinage fin (coûteux relativement, ~400 échantillons) : la
// quasi-totalité des fenêtres de jour n'ont même pas l'ISS qui s'approche du Soleil, pas la peine
// d'affiner une fenêtre où le minimum grossier est déjà loin de tout transit possible.
const CANDIDATE_MARGIN_FACTOR = 3;

export type SolarTransit = {
  midDate: Date; // instant de séparation minimale (milieu du transit)
  durationMs: number;
  angularSizeArcsec: number; // taille apparente de l'ISS
  missDistanceArcmin: number; // distance angulaire de traversée (séparation minimale)
  chordArcmin: number; // distance angulaire parcourue par l'ISS À L'INTÉRIEUR du disque solaire
  azimuth: number; // degrés, au milieu du transit
  altitude: number; // degrés, au milieu du transit
  sunAngularRadiusArcmin: number;
  // Distance oblique observateur→ISS au milieu du transit (km) — reprise de TopocentricPosition,
  // nécessaire à la ligne de visibilité au sol (voir transitGroundPath.ts : la largeur de la bande
  // dépend de cette distance).
  issRangeKm: number;
  // Direction de déplacement apparent de l'ISS par rapport au Soleil, dans le plan tangent local
  // azimut/altitude (0° = vers l'azimut croissant, 90° = vers l'altitude croissante) — sert à orienter
  // le schéma à l'échelle (TransitDiagram) selon la vraie géométrie du passage, plutôt qu'une
  // trajectoire horizontale arbitraire.
  pathAngleDeg: number;
  // Position de l'ISS par rapport au centre du Soleil au milieu du transit, dans le même plan tangent
  // (arcmin) — équivalent signé de missDistanceArcmin, nécessaire pour placer le schéma du bon côté.
  offsetXArcmin: number;
  offsetYArcmin: number;
};

// SphericalCoordinate d'Observerly utilise des clés grecques (θ/φ), vérifié en direct (les clés
// ASCII "theta"/"phi" donnent silencieusement NaN) — alt/az et dec/ra s'y insèrent directement
// (θ = angle polaire = altitude/déclinaison, φ = angle azimutal = azimut/ascension droite).
const toSpherical = (polar: number, azimuthal: number): SphericalCoordinate => ({ θ: polar, φ: azimuthal });

const getSunHorizontal = (date: Date, observer: GeographicCoordinate) =>
  convertEquatorialToHorizontal(date, observer, getSolarEquatorialCoordinate(date));

type SeparationSample = {
  t: number;
  separationDeg: number;
  iss: TopocentricPosition;
};

// Séparation angulaire ISS↔Soleil à un instant donné, ou `null` si l'ISS n'est pas propageable à
// cet instant précis (SGP4 en échec, rare).
const getSeparationSample = (satrec: SatrecHandle, t: number, observer: GeographicCoordinate): SeparationSample | null => {
  const date = new Date(t);
  const iss = getTopocentricPosition(satrec, date, observer);
  if (!iss) return null;
  const sun = getSunHorizontal(date, observer);
  const separationDeg = getAngularSeparation(toSpherical(iss.elevation, iss.azimuth), toSpherical(sun.alt, sun.az));
  return { t, separationDeg, iss };
};

// Recherche un franchissement de seuil par interpolation linéaire entre échantillons adjacents, en
// partant de `fromIndex` et en avançant dans la direction donnée — même principe que
// findPreviousHorizonCrossing/findNextHorizonCrossing (altitudeCurve.ts), appliqué ici à la
// séparation angulaire plutôt qu'à l'altitude, sur une liste d'échantillons déjà en mémoire plutôt
// que recalculés à la volée.
const findThresholdCrossing = (
  samples: SeparationSample[],
  fromIndex: number,
  thresholdDeg: number,
  direction: "backward" | "forward"
): number | null => {
  const step = direction === "backward" ? -1 : 1;
  for (let i = fromIndex; direction === "backward" ? i > 0 : i < samples.length - 1; i += step) {
    const current = samples[i];
    const next = samples[i + step];
    const crossing = direction === "backward"
      ? next.separationDeg >= thresholdDeg && current.separationDeg < thresholdDeg
      : current.separationDeg < thresholdDeg && next.separationDeg >= thresholdDeg;
    if (crossing) {
      const ratio = (thresholdDeg - current.separationDeg) / (next.separationDeg - current.separationDeg);
      return current.t + ratio * (next.t - current.t);
    }
  }
  return null;
};

// Affine un transit autour d'un instant déjà approximativement connu (voir findSolarTransits) —
// réutilisé tel quel par la fiche détail pour retrouver le même transit à partir de son horodatage
// de route, sans re-scanner plusieurs jours une seconde fois.
export const refineSolarTransitAround = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  approximateDate: Date
): SolarTransit | null => {
  const centerMs = approximateDate.getTime();
  const samples: SeparationSample[] = [];

  for (let t = centerMs - FINE_HALF_WINDOW_MS; t <= centerMs + FINE_HALF_WINDOW_MS; t += FINE_STEP_MS) {
    const sample = getSeparationSample(satrec, t, observer);
    if (sample) samples.push(sample);
  }

  if (samples.length === 0) return null;

  let minIndex = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].separationDeg < samples[minIndex].separationDeg) minIndex = i;
  }
  const minSample = samples[minIndex];

  const sunRadiusDeg = getSolarAngularDiameter(new Date(minSample.t)) / 2;
  // Rayon angulaire de l'ISS (formule des petits angles) — sa taille physique ÷ distance oblique,
  // les deux convertis en mètres.
  const issRadiusDeg = (ISS_PHYSICAL_SIZE_METERS / (minSample.iss.rangeKm * 1000)) * (180 / Math.PI) / 2;
  const thresholdDeg = sunRadiusDeg + issRadiusDeg;

  // Pas un vrai transit : l'ISS s'approche, mais son disque ne touche jamais celui du Soleil.
  if (minSample.separationDeg >= thresholdDeg) return null;

  const entryMs = findThresholdCrossing(samples, minIndex, thresholdDeg, "backward") ?? samples[0].t;
  const exitMs = findThresholdCrossing(samples, minIndex, thresholdDeg, "forward") ?? samples[samples.length - 1].t;

  // Corde parcourue par l'ISS À L'INTÉRIEUR du disque solaire (pas du seuil ISS+Soleil) — géométrie
  // du cercle : une droite passant à une distance perpendiculaire `d` du centre d'un cercle de
  // rayon `r` y trace une corde de longueur 2×√(r²−d²). Sur la ligne centrale (d=0), ça redonne
  // bien le diamètre du Soleil, cohérent avec transit-finder.com.
  const chordDeg = 2 * Math.sqrt(Math.max(sunRadiusDeg ** 2 - minSample.separationDeg ** 2, 0));

  // Position de l'ISS par rapport au Soleil dans un plan tangent local (azimut corrigé par
  // cos(altitude), altitude) — le Soleil bouge négligeablement sur les quelques secondes du transit,
  // on le fixe donc à sa position au milieu du transit pour tout le calcul de direction.
  const sunAtMin = getSunHorizontal(new Date(minSample.t), observer);
  const toTangentPlane = (point: { azimuth: number; elevation: number }) => {
    // Normalise la différence d'azimut dans [-180, 180] : un passage près du nord (azimuts proches
    // de 0°/360°) donnerait sinon un vecteur de direction aberrant.
    const deltaAz = (((point.azimuth - sunAtMin.az + 540) % 360) - 180);
    return {
      x: deltaAz * Math.cos((sunAtMin.alt * Math.PI) / 180),
      y: point.elevation - sunAtMin.alt,
    };
  };

  const firstPoint = toTangentPlane(samples[0].iss);
  const lastPoint = toTangentPlane(samples[samples.length - 1].iss);
  const pathAngleRad = Math.atan2(lastPoint.y - firstPoint.y, lastPoint.x - firstPoint.x);
  const offsetAtMin = toTangentPlane(minSample.iss);

  return {
    midDate: new Date(minSample.t),
    durationMs: exitMs - entryMs,
    angularSizeArcsec: issRadiusDeg * 2 * 3600,
    missDistanceArcmin: minSample.separationDeg * 60,
    chordArcmin: chordDeg * 60,
    azimuth: minSample.iss.azimuth,
    altitude: minSample.iss.elevation,
    sunAngularRadiusArcmin: sunRadiusDeg * 60,
    issRangeKm: minSample.iss.rangeKm,
    pathAngleDeg: (pathAngleRad * 180) / Math.PI,
    offsetXArcmin: offsetAtMin.x * 60,
    offsetYArcmin: offsetAtMin.y * 60,
  };
};

// Cœur commun des étapes 1 à 4, partagé par findSolarTransits (fenêtre fermée, choisie par
// l'utilisateur) et findNextSolarTransit (fenêtre ouverte, arrêt dès le premier transit confirmé
// trouvé) — `stopAtFirst` court-circuite le balayage dès qu'une fenêtre de jour a livré un transit,
// pour ne pas scanner inutilement le reste d'une fenêtre pouvant aller jusqu'à plusieurs mois.
const scanSolarTransits = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  startMs: number,
  endMs: number,
  stopAtFirst: boolean
): SolarTransit[] => {
  const transits: SolarTransit[] = [];

  // Étape 3+4 pour une fenêtre "ISS ET Soleil au-dessus du seuil" déjà repérée (étapes 1+2
  // ci-dessous) : repère le minimum local, puis affine seulement les candidats sérieux.
  const processWindow = (windowStartMs: number, windowEndMs: number) => {
    let bestT = windowStartMs;
    let bestSeparationDeg = Infinity;

    for (let t = windowStartMs; t <= windowEndMs; t += MEDIUM_STEP_MS) {
      const sample = getSeparationSample(satrec, t, observer);
      if (sample && sample.separationDeg < bestSeparationDeg) {
        bestSeparationDeg = sample.separationDeg;
        bestT = t;
      }
    }

    const sunRadiusDeg = getSolarAngularDiameter(new Date(bestT)) / 2;
    if (bestSeparationDeg > sunRadiusDeg * CANDIDATE_MARGIN_FACTOR) return;

    const transit = refineSolarTransitAround(satrec, observer, new Date(bestT));
    if (transit) transits.push(transit);
  };

  // Étapes 1+2 : repère les fenêtres "ISS ET Soleil au-dessus du seuil d'altitude" — le Soleil
  // n'est testé que si l'ISS l'est déjà (court-circuit), pour épargner le calcul solaire sur la
  // quasi-totalité des échantillons (l'ISS n'est au-dessus de l'horizon qu'une fraction du temps).
  let windowStartMs: number | null = null;

  for (let t = startMs; t <= endMs; t += COARSE_STEP_MS) {
    const iss = getTopocentricPosition(satrec, new Date(t), observer);
    const isDaytime = !!iss && iss.elevation >= MIN_ALTITUDE_DEGREES && getSunHorizontal(new Date(t), observer).alt >= MIN_ALTITUDE_DEGREES;

    if (isDaytime && windowStartMs === null) {
      windowStartMs = t;
    } else if (!isDaytime && windowStartMs !== null) {
      processWindow(windowStartMs - COARSE_STEP_MS, t + COARSE_STEP_MS);
      windowStartMs = null;
      if (stopAtFirst && transits.length > 0) return transits;
    }
  }
  if (windowStartMs !== null) processWindow(windowStartMs - COARSE_STEP_MS, endMs);

  return transits;
};

// Recherche complète sur la période choisie par l'utilisateur (dates de début/fin personnalisées,
// plutôt qu'une fenêtre fixe de X jours à partir d'aujourd'hui) — voir le détail des 4 étapes dans
// le commentaire des constantes ci-dessus et dans docs/agents-reference.md.
export const findSolarTransits = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  { startDate, endDate }: { startDate: Date; endDate: Date }
): SolarTransit[] => scanSolarTransits(satrec, observer, startDate.getTime(), endDate.getTime(), false);

// Recherche du tout premier transit à venir, sans borne de fenêtre choisie par l'utilisateur — peut
// prendre plusieurs secondes (voir le disclaimer affiché à l'écran), d'où l'arrêt dès le premier
// transit confirmé (stopAtFirst) plutôt qu'un balayage complet de maxDays.
export const findNextSolarTransit = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  { fromDate = new Date(), maxDays }: { fromDate?: Date; maxDays: number }
): SolarTransit | null => {
  const transits = scanSolarTransits(satrec, observer, fromDate.getTime(), fromDate.getTime() + maxDays * 24 * 60 * 60 * 1000, true);
  return transits[0] ?? null;
};
