import { convertEquatorialToHorizontal, EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon } from "@observerly/astrometry";
import { Dayjs } from "dayjs";
import { convertDMSToDegreeFromString } from "../DmsToDegree";
import { convertHMSToDegreeFromString } from "../HmsToDegree";
import { getPlanetMagnitude } from "../objects/getPlanetMagnitude";
import { DSO } from "../../../types/DSO";
import { GlobalPlanet } from "../../../types/GlobalPlanet";
import { Star } from "../../../types/Star";
import { computeObject } from "../objects/computeObject";

export interface ObservationPlannerParams {
  dsoCatalog: DSO[];
  planetsCatalog: GlobalPlanet[];
  starsCatalog: Star[];
  perObjectObsTime: number | null; // in minutes
  locale: string;
  location: {
    latitude: number;
    longitude: number;
  };
  date: {
    start: Dayjs; // Date only 
    end: Dayjs; // Date only
    startTime: Dayjs; // Date with time
    endTime: Dayjs; // Date with time
  }
  objects: {
    dso: boolean;
    planets: boolean;
    stars: boolean;
  }
  magnitude: {
    min: number | null;
    max: number | null;
  }
  altitude: {
    min: number | null;
    max: number | null;
  }
  maxResults: number | null;
}

export const planObservationNight = async (params: ObservationPlannerParams): Promise<(DSO | GlobalPlanet | Star)[]> => {
  // Some constants
  const DEFAULT_OBS_TIME_PER_OBJECT = params.perObjectObsTime || 5; // in minutes
  const OBSERVER: GeographicCoordinate = { latitude: params.location.latitude, longitude: params.location.longitude };
  const MINIMUM_ALTITUDE_DEGREE = 5; // Minimum altitude to consider an object visible
  const MAXIMUM_ALTITUDE_DEGREE = 90; // Maximum altitude to consider an object visible
  const OBS_WINDOW_TIME_MINUTES = params.date.endTime.diff(params.date.startTime, 'minute'); // Total observation window in minutes
  const OBS_COUNT_LIMIT = OBS_WINDOW_TIME_MINUTES / DEFAULT_OBS_TIME_PER_OBJECT; // Max number of objects that can be observed in the given time
  const RESULTS_CATALOG: (DSO | GlobalPlanet | Star)[] = [];


  try {
    let preFilteredDSOs: DSO[] = [];
    if(params.objects.dso){
      preFilteredDSOs = params.dsoCatalog.filter((dso: DSO) => {
        // Magnitude filter
        // If v_mag is a string, skip the object
        if(typeof dso.v_mag === 'string') return false;
        if(params.magnitude.min !== null && dso.v_mag < params.magnitude.min) return false;
        if(params.magnitude.max !== null && dso.v_mag > params.magnitude.max) return false;
        return true;
      })
      console.log(`[planObservationNight] ${preFilteredDSOs.length} DSOs after pre-filtering`);
    }

    let preFilteredStars: Star[] = [];
    if(params.objects.stars){
      preFilteredStars = params.starsCatalog.filter((star: Star) => {
        // Magnitude filter
        if(params.magnitude.min !== null && star.V < params.magnitude.min) return false;
        if(params.magnitude.max !== null && star.V > params.magnitude.max) return false;
        return true;
      })
      console.log(`[planObservationNight] ${preFilteredStars.length} Stars after pre-filtering`);
    }


    /*
      Get all visible objects (isBodyAboveHorizon) among the preFilteredDSOs, preFilteredStars, and planetsCatalog
      Three phases : Start of the observation window, Mid observation window, End of the observation window
      For each phase, check which objects are above the horizon and within the altitude limits
      Store them in a map with the object as key and the number of phases it is visible as value
    */
    const visibleObjectsMap: Map<DSO | GlobalPlanet | Star, number> = new Map();

    const observationPhases: Dayjs[] = [
      params.date.startTime,
      params.date.startTime.add(OBS_WINDOW_TIME_MINUTES / 2, 'minute'),
      params.date.endTime
    ];

    for(const phaseTime of observationPhases){
      // DSOs
      if(params.objects.dso){
        for(const dso of preFilteredDSOs){
          const equatorialCoord: EquatorialCoordinate = {
            ra: convertHMSToDegreeFromString(dso.ra),
            dec: convertDMSToDegreeFromString(dso.dec)
          };
          const horizontalCoord = convertEquatorialToHorizontal(equatorialCoord, OBSERVER, phaseTime.toDate());
          if(isBodyAboveHorizon(horizontalCoord)){
            const altitude = horizontalCoord.altitude;
            // Check altitude limits
            if((params.altitude.min === null || altitude >= params.altitude.min) &&
               (params.altitude.max === null || altitude <= params.altitude.max)){
              // Object is visible in this phase
              const currentCount = visibleObjectsMap.get(dso) || 0;
              visibleObjectsMap.set(dso, currentCount + 1);
            }
          }
        }
      }

      // Stars
      if(params.objects.stars){
        for(const star of preFilteredStars){
          const equatorialCoord: EquatorialCoordinate = {
            ra: convertHMSToDegreeFromString(star.RA),
            dec: convertDMSToDegreeFromString(star.DEC)
          };
          const horizontalCoord = convertEquatorialToHorizontal(equatorialCoord, OBSERVER, phaseTime.toDate());
          if(isBodyAboveHorizon(horizontalCoord)){
            const altitude = horizontalCoord.altitude;
            // Check altitude limits
            if((params.altitude.min === null || altitude >= params.altitude.min) &&
               (params.altitude.max === null || altitude <= params.altitude.max)){
              // Object is visible in this phase
              const currentCount = visibleObjectsMap.get(star) || 0;
              visibleObjectsMap.set(star, currentCount + 1);
            }
          }
        }
      }

      // Planets
      if(params.objects.planets){
        for(const planet of params.planetsCatalog){
          const computedPlanet = computeObject({object: planet, observer: OBSERVER, lang: params.locale, altitude: 341});
          const horizontalCoord = computedPlanet.horizontal;
          if(isBodyAboveHorizon(horizontalCoord)){
            const altitude = horizontalCoord.altitude;
            // Check altitude limits
            if((params.altitude.min === null || altitude >= params.altitude.min) &&
               (params.altitude.max === null || altitude <= params.altitude.max)){
              // Object is visible in this phase
              const currentCount = visibleObjectsMap.get(planet) || 0;
              visibleObjectsMap.set(planet, currentCount + 1);
            }
          }
        }
      }
    }

    console.log(`[planObservationNight] ${visibleObjectsMap.size} objects visible in at least one phase`);

    /*
      Now, sort the visible objects by the number of phases they are visible in (descending)
      Then select the top N objects based on the observation count limit and max results
    */
    const sortedVisibleObjects = Array.from(visibleObjectsMap.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by visibility count descending
      .map(entry => entry[0]); // Extract the objects

    const finalSelectionCount = params.maxResults !== null 
      ? Math.min(OBS_COUNT_LIMIT, params.maxResults) 
      : OBS_COUNT_LIMIT;

    const finalPlannedObjects = sortedVisibleObjects.slice(0, finalSelectionCount);

    console.log(`[planObservationNight] Planning complete with ${finalPlannedObjects.length} objects selected`);

    return finalPlannedObjects;

    /*
      Note: This is a basic implementation and can be further enhanced by considering factors like:
      - Optimal sequencing based on sky position to minimize telescope movement
      - Prioritization based on object type or user preferences
      - Dynamic adjustment based on real-time conditions (e.g., weather, seeing)
    */


  } catch (error) {
    console.log(`[planObservationNight] Erreur lors de la planification de la nuit d'observation : ${error}`);
    
  }

  return [];
};
