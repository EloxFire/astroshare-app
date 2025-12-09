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
    for(let i = 0; i < OBS_COUNT_LIMIT; i++) { // Pour chaque créneau d'observation possible
      let dsosVisible: DSO[] = [];
      let planetsVisible: GlobalPlanet[] = [];
      let starsVisible: Star[] = [];

      const currentObsTime = params.date.startTime.add(i * DEFAULT_OBS_TIME_PER_OBJECT, 'minute');

      // DSOs
      if(params.objects.dso){
        params.dsoCatalog.forEach((dso: DSO) => {
          const dsoInfos =  computeObject({object: dso, observer: OBSERVER, lang: params.locale, altitude: 341});
          if(dsoInfos) {
            console.log(`[planObservationNight] DSO ${dsoInfos.base.name} computed for observation step ${i}`);
            
          }
        })
      }
    }
  } catch (error) {
    console.log(`[planObservationNight] Erreur lors de la planification de la nuit d'observation : ${error}`);
    
  }

  return [];
};
