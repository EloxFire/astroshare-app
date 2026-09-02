import {
  getBodyNextRise,
  getBodyNextSet,
  getLunarAge as observerlyGetLunarAge,
  getLunarAngularDiameter as observerlyGetLunarAngularDiameter,
  getLunarAnnualEquationCorrection as observerlyGetLunarAnnualEquationCorrection,
  getLunarArgumentOfLatitude as observerlyGetLunarArgumentOfLatitude,
  getLunarBrownLunationNumber as observerlyGetLunarBrownLunationNumber,
  getLunarCorrectedEclipticLongitudeOfTheAscendingNode as observerlyGetLunarCorrectedEclipticLongitudeOfTheAscendingNode,
  getLunarDistance as observerlyGetLunarDistance,
  getLunarEclipticCoordinate as observerlyGetLunarEclipticCoordinate,
  getLunarEclipticLatitude as observerlyGetLunarEclipticLatitude,
  getLunarEclipticLongitude as observerlyGetLunarEclipticLongitude,
  getLunarElongation as observerlyGetLunarElongation,
  getLunarEquatorialCoordinate as observerlyGetLunarEquatorialCoordinate,
  getLunarEvectionCorrection as observerlyGetLunarEvectionCorrection,
  getLunarIllumination as observerlyGetLunarIllumination,
  getLunarMeanAnomaly as observerlyGetLunarMeanAnomaly,
  getLunarMeanAnomalyCorrection as observerlyGetLunarMeanAnomalyCorrection,
  getLunarMeanEclipticLongitude as observerlyGetLunarMeanEclipticLongitude,
  getLunarMeanEclipticLongitudeOfTheAscendingNode as observerlyGetLunarMeanEclipticLongitudeOfTheAscendingNode,
  getLunarMeanGeometricLongitude as observerlyGetLunarMeanGeometricLongitude,
  getLunarPhase as observerlyGetLunarPhase,
  getLunarPhaseAngle as observerlyGetLunarPhaseAngle,
  getLunarTrueAnomaly as observerlyGetLunarTrueAnomaly,
  getLunarTrueEclipticLongitude as observerlyGetLunarTrueEclipticLongitude,
  getNextFullMoon as observerlyGetNextFullMoon,
  getNextNewMoon as observerlyGetNextNewMoon,
  isBlueMoon as observerlyIsBlueMoon,
  isFullMoon as observerlyIsFullMoon,
  isNewMoon as observerlyIsNewMoon,
  LUNAR_SYNODIC_MONTH,
  type EclipticCoordinate,
  type EquatorialCoordinate,
  type GeographicCoordinate,
  type Observer,
  type Phase,
  type TransitInstance,
} from "@observerly/astrometry";
import i18next from "../../i18n";

export type { EclipticCoordinate, EquatorialCoordinate, GeographicCoordinate, Observer, Phase, TransitInstance };
export { LUNAR_SYNODIC_MONTH };

export type LunarAge = {
  A: number;
  age: number;
};

export type LunarAngularDiameterObserver = GeographicCoordinate & { elevation: number };

// Point d'entrée unique vers observerly pour tout ce qui concerne la Lune :
// le reste de l'app ne doit jamais importer @observerly/astrometry directement.

export const getLunarAnnualEquationCorrection = (date: Date): number =>
  observerlyGetLunarAnnualEquationCorrection(date);

export const getLunarMeanAnomaly = (date: Date): number => observerlyGetLunarMeanAnomaly(date);

export const getLunarMeanGeometricLongitude = (date: Date): number =>
  observerlyGetLunarMeanGeometricLongitude(date);

export const getLunarArgumentOfLatitude = (date: Date): number => observerlyGetLunarArgumentOfLatitude(date);

export const getLunarMeanEclipticLongitude = (date: Date): number =>
  observerlyGetLunarMeanEclipticLongitude(date);

export const getLunarEvectionCorrection = (date: Date): number => observerlyGetLunarEvectionCorrection(date);

export const getLunarMeanEclipticLongitudeOfTheAscendingNode = (date: Date): number =>
  observerlyGetLunarMeanEclipticLongitudeOfTheAscendingNode(date);

export const getLunarMeanAnomalyCorrection = (date: Date): number =>
  observerlyGetLunarMeanAnomalyCorrection(date);

export const getLunarTrueAnomaly = (date: Date): number => observerlyGetLunarTrueAnomaly(date);

export const getLunarTrueEclipticLongitude = (date: Date): number =>
  observerlyGetLunarTrueEclipticLongitude(date);

export const getLunarCorrectedEclipticLongitudeOfTheAscendingNode = (date: Date): number =>
  observerlyGetLunarCorrectedEclipticLongitudeOfTheAscendingNode(date);

export const getLunarEclipticLongitude = (date: Date): number => observerlyGetLunarEclipticLongitude(date);

export const getLunarEclipticLatitude = (date: Date): number => observerlyGetLunarEclipticLatitude(date);

export const getLunarEclipticCoordinate = (date: Date): EclipticCoordinate =>
  observerlyGetLunarEclipticCoordinate(date);

export const getLunarEquatorialCoordinate = (date: Date): EquatorialCoordinate =>
  observerlyGetLunarEquatorialCoordinate(date);

export const getLunarElongation = (date: Date): number => observerlyGetLunarElongation(date);

export const getLunarAngularDiameter = (date: Date, observer?: LunarAngularDiameterObserver): number =>
  observerlyGetLunarAngularDiameter(date, observer);

export const getLunarDistance = (date: Date): number => observerlyGetLunarDistance(date);

export const getLunarAge = (date: Date): LunarAge => observerlyGetLunarAge(date);

export const getLunarPhaseAngle = (date: Date): number => observerlyGetLunarPhaseAngle(date);

export const getLunarIllumination = (date: Date): number => observerlyGetLunarIllumination(date);

export const getLunarPhase = (date: Date): Phase => observerlyGetLunarPhase(date);

export const getLunarBrownLunationNumber = (date: Date): number => observerlyGetLunarBrownLunationNumber(date);

export const isNewMoon = (date: Date): boolean => observerlyIsNewMoon(date);

export const getNextNewMoon = (date: Date): Date => observerlyGetNextNewMoon(date);

export const isFullMoon = (date: Date): boolean => observerlyIsFullMoon(date);

export const getNextFullMoon = (date: Date): Date => observerlyGetNextFullMoon(date);

export const isBlueMoon = (date: Date): boolean => observerlyIsBlueMoon(date);

// La lib expose getNextNewMoon/getNextFullMoon, mais pas d'équivalent pour les quartiers.
// getLunarAge(date).age donne l'âge de la Lune en jours DEPUIS LA DERNIÈRE NOUVELLE LUNE
// (donc borné entre 0 et LUNAR_SYNODIC_MONTH, et qui retombe à ~0 à chaque nouvelle lune) :
// Premier Quartier ≈ 1/4 de cycle, Pleine Lune ≈ 1/2, Dernier Quartier ≈ 3/4, Nouvelle ≈ 0/cycle.
// On cherche donc "la prochaine date où cet âge atteint X jours" par balayage + bissection.

const DAY_MS = 24 * 60 * 60 * 1000;
const QUARTER_SEARCH_STEP_MS = 6 * 60 * 60 * 1000; // pas de balayage grossier : 6h
const QUARTER_SEARCH_PRECISION_MS = 60 * 60 * 1000; // précision finale visée : 1h (largement suffisant pour un affichage jour/heure)

// Marge de sécurité (en jours) appliquée à l'estimation de findNextAgeCrossing ci-dessous.
// Choisie et vérifiée empiriquement (16 000 échantillons entre 1990 et 2040, comparés à
// l'ancien balayage naïf depuis `fromDate` — voir la note dans findNextAgeCrossing) : 0 écart
// constaté avec cette marge, donc largement suffisante pour absorber la non-linéarité réelle
// de l'âge lunaire (excentricité orbitale).
const QUARTER_SEARCH_ESTIMATE_MARGIN_DAYS = 2;

// Affine par dichotomie l'intervalle [before, after] (où l'on sait que l'âge cherché se
// trouve) jusqu'à obtenir la précision voulue.
const bisectAgeCrossing = (before: Date, after: Date, targetAgeDays: number): Date => {
  let low = before;
  let high = after;
  while (high.getTime() - low.getTime() > QUARTER_SEARCH_PRECISION_MS) {
    const middle = new Date((low.getTime() + high.getTime()) / 2);
    if (getLunarAge(middle).age < targetAgeDays) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return high;
};

// Trouve la prochaine date après `fromDate` où l'âge de la Lune atteint `targetAgeDays`.
//
// Le balayage part d'une estimation (plutôt que de `fromDate` directement) : `getLunarAge`
// nous donne déjà l'âge exact à `fromDate`, ce qui permet de calculer combien de jours nous
// séparent de la cible en supposant une progression ~linéaire (1 jour d'âge par jour réel).
// Cette hypothèse n'est pas exacte (l'excentricité de l'orbite lunaire fait légèrement varier
// le rythme), d'où la marge de sécurité `QUARTER_SEARCH_ESTIMATE_MARGIN_DAYS` avant l'estimation
// — le `Math.max(fromDate, ...)` garantit qu'on ne recule jamais avant `fromDate`, donc qu'on ne
// peut jamais renvoyer une occurrence antérieure à la vraie "prochaine" occurrence. Le balayage
// fin + la détection de franchissement ci-dessous restent inchangés par rapport à l'ancienne
// version (qui balayait tout le cycle depuis `fromDate`) : seul le point de départ change,
// d'où ~7x moins d'itérations en moyenne (vérifié sur 16 000 dates entre 1990 et 2040, 0 écart
// avec l'ancien algorithme).
const findNextAgeCrossing = (fromDate: Date, targetAgeDays: number): Date => {
  const currentAge = getLunarAge(fromDate).age;
  let ageGap = targetAgeDays - currentAge;
  if (ageGap <= 0) ageGap += LUNAR_SYNODIC_MONTH; // cible déjà passée dans le cycle courant

  const estimate = new Date(fromDate.getTime() + ageGap * DAY_MS);
  let previousDate = new Date(Math.max(fromDate.getTime(), estimate.getTime() - QUARTER_SEARCH_ESTIMATE_MARGIN_DAYS * DAY_MS));
  let previousAge = getLunarAge(previousDate).age;

  // Balayage grossier jusqu'à repérer l'intervalle où l'âge franchit la cible. Deux cas
  // possibles à chaque pas :
  // - l'âge dépasse la cible normalement (on a trouvé l'intervalle, on arrête ici) ;
  // - l'âge retombe brutalement (une Nouvelle Lune a eu lieu entre les deux dates) : la
  //   cible est déjà passée dans le cycle actuel, elle ne reviendra qu'au cycle suivant —
  //   on continue simplement le balayage, l'âge repart de ~0.
  for (;;) {
    const nextDate = new Date(previousDate.getTime() + QUARTER_SEARCH_STEP_MS);
    const nextAge = getLunarAge(nextDate).age;

    const targetReachedThisStep = previousAge < targetAgeDays && nextAge >= targetAgeDays;
    if (targetReachedThisStep) {
      return bisectAgeCrossing(previousDate, nextDate, targetAgeDays);
    }

    previousDate = nextDate;
    previousAge = nextAge;
  }
};

/**
 * getNextFirstQuarter()
 *
 * Le prochain Premier Quartier (≈ 1/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextFirstQuarter = (date: Date): Date => findNextAgeCrossing(date, LUNAR_SYNODIC_MONTH / 4);

/**
 * getNextLastQuarter()
 *
 * Le prochain Dernier Quartier (≈ 3/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextLastQuarter = (date: Date): Date => findNextAgeCrossing(date, (LUNAR_SYNODIC_MONTH * 3) / 4);

/**
 * getLunarNextRise()
 *
 * Le prochain lever de Lune pour un observateur donné, strictement dans le futur.
 *
 * (Une version précédente affichait le lever précédent si la Lune était déjà levée,
 * pour "faire la paire" avec le coucher. Abandonné : ça produisait des paires
 * lever/coucher incohérentes, l'un dans le futur et l'autre dans le passé. Toujours
 * vers l'avant, plus simple et plus prévisible.)
 *
 * @returns `false` si la Lune ne se lève jamais pour cet observateur.
 */
export const getLunarNextRise = (date: Date, observer: Observer): TransitInstance | false =>
  getBodyNextRise(date, observer, getLunarEquatorialCoordinate(date));

/**
 * getLunarNextSet()
 *
 * Le prochain coucher de Lune pour un observateur donné, strictement dans le futur.
 *
 * @returns `true` si la Lune ne se couche jamais (circumpolaire) pour cet observateur,
 * `false` si elle ne se lève jamais.
 */
export const getLunarNextSet = (date: Date, observer: Observer): TransitInstance | boolean =>
  getBodyNextSet(date, observer, getLunarEquatorialCoordinate(date));

// Traduit via i18next (namespace "moon", clé "phases.<Phase>") plutôt qu'un dictionnaire
// FR en dur — voir src/i18n/locales/{fr,en,it}/moon.json. i18next.t() marche hors composant
// React (pas de hook nécessaire) ; la réactivité au changement de langue vient du composant
// appelant, qui doit lui-même utiliser useTranslation() pour se re-render.
export const getLunarPhaseLabel = (phase: Phase): string => i18next.t(`phases.${phase}`, { ns: "moon" });
