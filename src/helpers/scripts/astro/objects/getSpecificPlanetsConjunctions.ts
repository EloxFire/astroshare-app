import {
  findPlanetaryConjunction,
  GeographicCoordinate,
  Interval,
  Planet
} from "@observerly/astrometry";

export const getSpecificPlanetsConjunctions = (targets: [Planet, Planet], observer: GeographicCoordinate, interval: Interval, separation: number): any => {
  return findPlanetaryConjunction(interval, observer, targets, {angularSeparationThreshold: separation});
}