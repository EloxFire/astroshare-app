import {
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
} from "@observerly/astrometry";

export type { EclipticCoordinate, EquatorialCoordinate, GeographicCoordinate, Observer, Phase };
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
