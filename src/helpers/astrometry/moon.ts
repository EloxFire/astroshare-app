import {
  getBodyNextRise,
  getBodyNextSet,
  isBodyAboveHorizon,
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

// La Lune met environ un jour lunaire (~24h50) entre deux levers (ou deux couchers)
// identiques : reculer de 30h avant de rechercher en avant garantit de retomber sur
// l'occurrence précédente, sans jamais remonter jusqu'à celle d'avant.
const PREVIOUS_TRANSIT_SEARCH_MARGIN_MS = 30 * 60 * 60 * 1000;

/**
 * getLunarNextRise()
 *
 * Le prochain lever de Lune pour un observateur donné. Si la Lune est déjà levée
 * à `date` (donc son "prochain lever" au sens strict serait demain), on renvoie à
 * la place son lever précédent (celui en cours), plus pertinent à afficher.
 *
 * @returns Le lever (précédent ou suivant selon le cas), `false` si la Lune ne se
 * lève jamais pour cet observateur.
 */
export const getLunarNextRise = (date: Date, observer: Observer): TransitInstance | false => {
  const alreadyRisen = isBodyAboveHorizon(date, observer, getLunarEquatorialCoordinate(date));
  const searchFrom = alreadyRisen ? new Date(date.getTime() - PREVIOUS_TRANSIT_SEARCH_MARGIN_MS) : date;
  return getBodyNextRise(searchFrom, observer, getLunarEquatorialCoordinate(searchFrom));
};

/**
 * getLunarNextSet()
 *
 * Le prochain coucher de Lune pour un observateur donné. Si la Lune est déjà
 * couchée à `date` (donc son "prochain coucher" au sens strict serait après le
 * prochain lever, potentiellement demain), on renvoie à la place son coucher
 * précédent — pour toujours afficher une paire cohérente avec `getLunarNextRise`
 * (levée → lever précédent + coucher suivant ; couchée → coucher précédent + lever suivant).
 *
 * @returns Le coucher (précédent ou suivant selon le cas), `true` si la Lune ne se
 * couche jamais (circumpolaire) pour cet observateur, `false` si elle ne se lève jamais.
 */
export const getLunarNextSet = (date: Date, observer: Observer): TransitInstance | boolean => {
  const alreadySet = !isBodyAboveHorizon(date, observer, getLunarEquatorialCoordinate(date));
  const searchFrom = alreadySet ? new Date(date.getTime() - PREVIOUS_TRANSIT_SEARCH_MARGIN_MS) : date;
  return getBodyNextSet(searchFrom, observer, getLunarEquatorialCoordinate(searchFrom));
};

const LUNAR_PHASE_LABELS_FR: Record<Phase, string> = {
  New: "Nouvelle lune",
  "Waxing Crescent": "Croissant montant",
  "First Quarter": "Premier quartier",
  "Waxing Gibbous": "Gibbeuse croissante",
  Full: "Pleine lune",
  "Waning Gibbous": "Gibbeuse décroissante",
  "Last Quarter": "Dernier quartier",
  "Waning Crescent": "Croissant descendant",
  Invalid: "Phase inconnue",
};

export const getLunarPhaseLabel = (phase: Phase): string => LUNAR_PHASE_LABELS_FR[phase];
