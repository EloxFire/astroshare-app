import { convertEquatorialToHorizontal, EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon } from "@observerly/astrometry";
import { Dayjs } from "dayjs";
import { convertDMSToDegreeFromString } from "../DmsToDegree";
import { convertHMSToDegreeFromString } from "../HmsToDegree";
import { getPlanetMagnitude } from "../objects/getPlanetMagnitude";
import { DSO } from "../../../types/DSO";
import { GlobalPlanet } from "../../../types/GlobalPlanet";
import { Star } from "../../../types/Star";

export interface ObservationPlannerParams {
  dsoCatalog: DSO[];
  planetsCatalog: GlobalPlanet[];
  starsCatalog: Star[];
  perObjectObsTime: number | null; // in minutes
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
    // Build a for loop over dates from start to end in DEFAULT_OBS_TIME_PER_OBJECT minutes increments
    for (let currentTime = params.date.startTime; currentTime.isBefore(params.date.endTime); currentTime = currentTime.add(DEFAULT_OBS_TIME_PER_OBJECT, 'minute')) {
      if(params.objects.dso) {
        for (const dso of params.dsoCatalog) {
          const degRa = convertHMSToDegreeFromString(dso.ra);
          const degDec = convertDMSToDegreeFromString(dso.dec);
          const target: EquatorialCoordinate = { ra: degRa, dec: degDec };

          if(isBodyAboveHorizon(currentTime.toDate(), OBSERVER, target, MINIMUM_ALTITUDE_DEGREE)) {
            RESULTS_CATALOG.push(dso);
          }
        }
      }
      console.log(`[planObservationNight] After DSO check at ${currentTime.format('HH:mm')}, found ${RESULTS_CATALOG.length} objects.`);
      
    }
  } catch (error) {
    console.log(`[planObservationNight] Erreur lors de la planification de la nuit d'observation : ${error}`);
    
  }

  return [];
};
