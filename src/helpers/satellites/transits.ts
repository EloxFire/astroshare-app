import {
  convertEquatorialToHorizontal,
  getAngularSeparation,
  getLunarAngularDiameter,
  getLunarEquatorialCoordinate,
  getSolarAngularDiameter,
  getSolarEquatorialCoordinate,
  type EquatorialCoordinate,
  type GeographicCoordinate,
  type SphericalCoordinate,
} from "@observerly/astrometry";
import { getTopocentricPosition, type SatrecHandle, type TopocentricPosition } from "./propagation";

export type TargetBodyKey = "sun" | "moon";

export type TargetBody = {
  key: TargetBodyKey;
  getEquatorialCoordinate: (date: Date) => EquatorialCoordinate;
  // Diamètre angulaire apparent (degrés) : dépend de l'observateur pour la Lune (parallaxe non
  // négligeable, contrairement au Soleil — voir getLunarAngularDiameter), reçoit donc toujours
  // l'observateur même si le Soleil l'ignore.
  getAngularDiameterDeg: (date: Date, observer: GeographicCoordinate) => number;
};

// Les deux corps "assez grands et assez proches" pour qu'un satellite en orbite basse en transite
// devant, vus depuis le sol (contrairement aux planètes, bien trop petites apparemment pour ça).
export const TARGET_BODIES: Record<TargetBodyKey, TargetBody> = {
  sun: {
    key: "sun",
    getEquatorialCoordinate: getSolarEquatorialCoordinate,
    getAngularDiameterDeg: (date) => getSolarAngularDiameter(date),
  },
  moon: {
    key: "moon",
    getEquatorialCoordinate: getLunarEquatorialCoordinate,
    getAngularDiameterDeg: (date, observer) => getLunarAngularDiameter(date, { ...observer, elevation: observer.elevation ?? 0 }),
  },
};

export type SatelliteKey = "iss" | "tiangong";

export type TransitSatellite = {
  key: SatelliteKey;
  // Nom résolu via /v3/norad (recherche partielle, voir getSatelliteTle) — mêmes chaînes que
  // FEATURED_STATIONS (featured.ts), pas dupliquées différemment par coïncidence.
  nameQuery: string;
  // Dimension physique représentative (sa plus grande longueur) : aucune donnée de taille réelle
  // n'existe dans le catalogue satellite de l'app (vérifié), approximation courante pour ce genre de
  // calcul (même simplification que les calculateurs de transit grand public, voir
  // transit-finder.com). Tiangong : structure en T une fois les 3 modules amarrés (Tianhe + Wentian
  // + Mengtian), envergure totale approximative incluant les panneaux solaires.
  physicalSizeMeters: number;
};

export const TRANSIT_SATELLITES: Record<SatelliteKey, TransitSatellite> = {
  iss: { key: "iss", nameQuery: "ISS (ZARYA)", physicalSizeMeters: 109 },
  tiangong: { key: "tiangong", nameQuery: "CSS (TIANHE)", physicalSizeMeters: 55 },
};

// Décision actée avec l'utilisateur : un transit avec le corps visé (donc le satellite) trop bas
// n'est pas proposé du tout — plus difficile à observer et moins fiable géométriquement (réfraction).
const MIN_ALTITUDE_DEGREES = 10;

// Étape 1+2 (recherche grossière) : un pas large sur toute la fenêtre choisie par l'utilisateur
// (jusqu'à 14 jours), juste pour repérer les rares fenêtres "satellite ET corps visé au-dessus du
// seuil" — pas la peine d'une résolution fine ici, une fenêtre de jour/nuit dure plusieurs minutes.
const COARSE_STEP_MS = 60_000;
// Étape 3 : à l'intérieur d'une fenêtre, repère la région de plus faible séparation. N'a pas besoin
// de tomber pile sur le minimum réel (l'affinage de l'étape 4 s'en charge) : juste d'amener
// l'échantillon le plus proche à quelques centaines de ms du vrai minimum, largement suffisant pour
// tomber dans la fenêtre d'affinage de ±FINE_HALF_WINDOW_MS ci-dessous.
const MEDIUM_STEP_MS = 500;
// Étape 4 : le satellite traverse le corps visé en bien moins d'une seconde généralement —
// affinage nécessairement fin, mais seulement sur quelques secondes autour du minimum grossier.
const FINE_STEP_MS = 20;
const FINE_HALF_WINDOW_MS = 4_000;

// Marge large avant de déclencher l'affinage fin (coûteux relativement, ~400 échantillons) : la
// quasi-totalité des fenêtres n'ont même pas le satellite qui s'approche du corps visé, pas la
// peine d'affiner une fenêtre où le minimum grossier est déjà loin de tout transit possible.
const CANDIDATE_MARGIN_FACTOR = 3;

export type BodyTransit = {
  body: TargetBodyKey; // Soleil ou Lune — le corps devant lequel ce transit a lieu
  midDate: Date; // instant de séparation minimale (milieu du transit)
  durationMs: number;
  angularSizeArcsec: number; // taille apparente du satellite
  missDistanceArcmin: number; // distance angulaire de traversée (séparation minimale)
  chordArcmin: number; // distance angulaire parcourue par le satellite À L'INTÉRIEUR du disque
  azimuth: number; // degrés, au milieu du transit
  altitude: number; // degrés, au milieu du transit
  bodyAngularRadiusArcmin: number; // rayon apparent du Soleil/de la Lune à cet instant
  // Distance oblique observateur→satellite au milieu du transit (km) — reprise de
  // TopocentricPosition, nécessaire à la ligne de visibilité au sol (voir transitGroundPath.ts : la
  // largeur de la bande dépend de cette distance).
  satelliteRangeKm: number;
  // Direction de déplacement apparent du satellite par rapport au corps visé, dans le plan tangent
  // local azimut/altitude (0° = vers l'azimut croissant, 90° = vers l'altitude croissante) — sert à
  // orienter le schéma à l'échelle (TransitDiagram) selon la vraie géométrie du passage, plutôt
  // qu'une trajectoire horizontale arbitraire.
  pathAngleDeg: number;
  // Position du satellite par rapport au centre du corps visé au milieu du transit, dans le même
  // plan tangent (arcmin) — équivalent signé de missDistanceArcmin, nécessaire pour placer le
  // schéma du bon côté.
  offsetXArcmin: number;
  offsetYArcmin: number;
};

// SphericalCoordinate d'Observerly utilise des clés grecques (θ/φ), vérifié en direct (les clés
// ASCII "theta"/"phi" donnent silencieusement NaN) — alt/az et dec/ra s'y insèrent directement
// (θ = angle polaire = altitude/déclinaison, φ = angle azimutal = azimut/ascension droite).
const toSpherical = (polar: number, azimuthal: number): SphericalCoordinate => ({ θ: polar, φ: azimuthal });

const getBodyHorizontal = (date: Date, observer: GeographicCoordinate, targetBody: TargetBody) =>
  convertEquatorialToHorizontal(date, observer, targetBody.getEquatorialCoordinate(date));

type SeparationSample = {
  t: number;
  separationDeg: number;
  satellite: TopocentricPosition;
};

// Séparation angulaire satellite↔corps visé à un instant donné, ou `null` si le satellite n'est pas
// propageable à cet instant précis (SGP4 en échec, rare).
const getSeparationSample = (
  satrec: SatrecHandle,
  t: number,
  observer: GeographicCoordinate,
  targetBody: TargetBody
): SeparationSample | null => {
  const date = new Date(t);
  const satellite = getTopocentricPosition(satrec, date, observer);
  if (!satellite) return null;
  const body = getBodyHorizontal(date, observer, targetBody);
  const separationDeg = getAngularSeparation(toSpherical(satellite.elevation, satellite.azimuth), toSpherical(body.alt, body.az));
  return { t, separationDeg, satellite };
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

// Affine un transit autour d'un instant déjà approximativement connu (voir findBodyTransits) —
// réutilisé tel quel par la fiche détail pour retrouver le même transit à partir de son horodatage
// de route, sans re-scanner plusieurs jours une seconde fois.
export const refineTransitAround = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  approximateDate: Date,
  targetBody: TargetBody,
  satellitePhysicalSizeMeters: number
): BodyTransit | null => {
  const centerMs = approximateDate.getTime();
  const samples: SeparationSample[] = [];

  for (let t = centerMs - FINE_HALF_WINDOW_MS; t <= centerMs + FINE_HALF_WINDOW_MS; t += FINE_STEP_MS) {
    const sample = getSeparationSample(satrec, t, observer, targetBody);
    if (sample) samples.push(sample);
  }

  if (samples.length === 0) return null;

  let minIndex = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].separationDeg < samples[minIndex].separationDeg) minIndex = i;
  }
  const minSample = samples[minIndex];

  const bodyRadiusDeg = targetBody.getAngularDiameterDeg(new Date(minSample.t), observer) / 2;
  // Rayon angulaire du satellite (formule des petits angles) — sa taille physique ÷ distance
  // oblique, les deux convertis en mètres.
  const satelliteRadiusDeg = (satellitePhysicalSizeMeters / (minSample.satellite.rangeKm * 1000)) * (180 / Math.PI) / 2;
  const thresholdDeg = bodyRadiusDeg + satelliteRadiusDeg;

  // Pas un vrai transit : le satellite s'approche, mais son disque ne touche jamais celui du corps visé.
  if (minSample.separationDeg >= thresholdDeg) return null;

  const entryMs = findThresholdCrossing(samples, minIndex, thresholdDeg, "backward") ?? samples[0].t;
  const exitMs = findThresholdCrossing(samples, minIndex, thresholdDeg, "forward") ?? samples[samples.length - 1].t;

  // Corde parcourue par le satellite À L'INTÉRIEUR du disque (pas du seuil satellite+corps) —
  // géométrie du cercle : une droite passant à une distance perpendiculaire `d` du centre d'un
  // cercle de rayon `r` y trace une corde de longueur 2×√(r²−d²). Sur la ligne centrale (d=0), ça
  // redonne bien le diamètre du corps visé, cohérent avec transit-finder.com.
  const chordDeg = 2 * Math.sqrt(Math.max(bodyRadiusDeg ** 2 - minSample.separationDeg ** 2, 0));

  // Position du satellite par rapport au corps visé dans un plan tangent local (azimut corrigé par
  // cos(altitude), altitude) — le corps visé bouge négligeablement sur les quelques secondes du
  // transit, on le fixe donc à sa position au milieu du transit pour tout le calcul de direction.
  const bodyAtMin = getBodyHorizontal(new Date(minSample.t), observer, targetBody);
  const toTangentPlane = (point: { azimuth: number; elevation: number }) => {
    // Normalise la différence d'azimut dans [-180, 180] : un passage près du nord (azimuts proches
    // de 0°/360°) donnerait sinon un vecteur de direction aberrant.
    const deltaAz = (((point.azimuth - bodyAtMin.az + 540) % 360) - 180);
    return {
      x: deltaAz * Math.cos((bodyAtMin.alt * Math.PI) / 180),
      y: point.elevation - bodyAtMin.alt,
    };
  };

  const firstPoint = toTangentPlane(samples[0].satellite);
  const lastPoint = toTangentPlane(samples[samples.length - 1].satellite);
  const pathAngleRad = Math.atan2(lastPoint.y - firstPoint.y, lastPoint.x - firstPoint.x);
  const offsetAtMin = toTangentPlane(minSample.satellite);

  return {
    body: targetBody.key,
    midDate: new Date(minSample.t),
    durationMs: exitMs - entryMs,
    angularSizeArcsec: satelliteRadiusDeg * 2 * 3600,
    missDistanceArcmin: minSample.separationDeg * 60,
    chordArcmin: chordDeg * 60,
    azimuth: minSample.satellite.azimuth,
    altitude: minSample.satellite.elevation,
    bodyAngularRadiusArcmin: bodyRadiusDeg * 60,
    satelliteRangeKm: minSample.satellite.rangeKm,
    pathAngleDeg: (pathAngleRad * 180) / Math.PI,
    offsetXArcmin: offsetAtMin.x * 60,
    offsetYArcmin: offsetAtMin.y * 60,
  };
};

// Cœur commun des étapes 1 à 4, partagé par findBodyTransits (fenêtre fermée, choisie par
// l'utilisateur) et findNextBodyTransit (fenêtre ouverte, arrêt dès le premier transit confirmé
// trouvé) — `stopAtFirst` court-circuite le balayage dès qu'une fenêtre a livré un transit, pour ne
// pas scanner inutilement le reste d'une fenêtre pouvant aller jusqu'à plusieurs mois.
const scanBodyTransits = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  startMs: number,
  endMs: number,
  stopAtFirst: boolean,
  targetBody: TargetBody,
  satellitePhysicalSizeMeters: number
): BodyTransit[] => {
  const transits: BodyTransit[] = [];

  // Étape 3+4 pour une fenêtre "satellite ET corps visé au-dessus du seuil" déjà repérée (étapes
  // 1+2 ci-dessous) : repère le minimum local, puis affine seulement les candidats sérieux.
  const processWindow = (windowStartMs: number, windowEndMs: number) => {
    let bestT = windowStartMs;
    let bestSeparationDeg = Infinity;

    for (let t = windowStartMs; t <= windowEndMs; t += MEDIUM_STEP_MS) {
      const sample = getSeparationSample(satrec, t, observer, targetBody);
      if (sample && sample.separationDeg < bestSeparationDeg) {
        bestSeparationDeg = sample.separationDeg;
        bestT = t;
      }
    }

    const bodyRadiusDeg = targetBody.getAngularDiameterDeg(new Date(bestT), observer) / 2;
    if (bestSeparationDeg > bodyRadiusDeg * CANDIDATE_MARGIN_FACTOR) return;

    const transit = refineTransitAround(satrec, observer, new Date(bestT), targetBody, satellitePhysicalSizeMeters);
    if (transit) transits.push(transit);
  };

  // Étapes 1+2 : repère les fenêtres "satellite ET corps visé au-dessus du seuil d'altitude" — le
  // corps visé n'est testé que si le satellite l'est déjà (court-circuit), pour épargner le calcul
  // sur la quasi-totalité des échantillons (le satellite n'est au-dessus de l'horizon qu'une
  // fraction du temps).
  let windowStartMs: number | null = null;

  for (let t = startMs; t <= endMs; t += COARSE_STEP_MS) {
    const satellite = getTopocentricPosition(satrec, new Date(t), observer);
    const isVisible = !!satellite && satellite.elevation >= MIN_ALTITUDE_DEGREES
      && getBodyHorizontal(new Date(t), observer, targetBody).alt >= MIN_ALTITUDE_DEGREES;

    if (isVisible && windowStartMs === null) {
      windowStartMs = t;
    } else if (!isVisible && windowStartMs !== null) {
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
export const findBodyTransits = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  { startDate, endDate }: { startDate: Date; endDate: Date },
  targetBody: TargetBody,
  satellitePhysicalSizeMeters: number
): BodyTransit[] => scanBodyTransits(satrec, observer, startDate.getTime(), endDate.getTime(), false, targetBody, satellitePhysicalSizeMeters);

// Recherche du tout premier transit à venir, sans borne de fenêtre choisie par l'utilisateur — peut
// prendre plusieurs secondes (voir le disclaimer affiché à l'écran), d'où l'arrêt dès le premier
// transit confirmé (stopAtFirst) plutôt qu'un balayage complet de maxDays.
export const findNextBodyTransit = (
  satrec: SatrecHandle,
  observer: GeographicCoordinate,
  { fromDate = new Date(), maxDays }: { fromDate?: Date; maxDays: number },
  targetBody: TargetBody,
  satellitePhysicalSizeMeters: number
): BodyTransit | null => {
  const transits = scanBodyTransits(
    satrec, observer, fromDate.getTime(), fromDate.getTime() + maxDays * 24 * 60 * 60 * 1000, true, targetBody, satellitePhysicalSizeMeters
  );
  return transits[0] ?? null;
};
