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
        // Skip asterisms
        if ((dso.type || '').toLowerCase() === '*ass') return false;

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


    const effectiveMinAltitude = params.altitude.min ?? MINIMUM_ALTITUDE_DEGREE;
    const effectiveMaxAltitude = params.altitude.max ?? MAXIMUM_ALTITUDE_DEGREE;
    const phases: Date[] = [
      params.date.startTime.toDate(),
      params.date.startTime.add(OBS_WINDOW_TIME_MINUTES / 2, 'minute').toDate(),
      params.date.endTime.toDate()
    ];

    const getCategoryPriority = (object: DSO | GlobalPlanet | Star): number => {
      if (!('const' in object) && !('ids' in object)) return 2; // Planets
      if ('const' in object) return 1; // DSOs
      return 0; // Stars
    };

    const getDsoTypePriority = (object: DSO | GlobalPlanet | Star): number => {
      if (!('const' in object)) return -1;
      const type = object.type.toLowerCase();
      if (type.includes('galaxy') || type.includes('nebula')) return 3;
      if (type.includes('globular')) return 2;
      if (type.includes('open cluster')) return 1;
      return 0;
    };

    const getMagnitude = (object: DSO | GlobalPlanet | Star): number | null => {
      if ('const' in object) {
        return typeof object.v_mag === 'number' ? object.v_mag : null;
      }
      if ('ids' in object) {
        return typeof object.V === 'number' ? object.V : null;
      }
      return getPlanetMagnitude(object.name);
    };

    const visibleObjects = new Map<DSO | GlobalPlanet | Star, { count: number; maxAlt: number; magnitude: number | null; categoryPriority: number; dsoTypePriority: number }>();
    const addVisibility = (object: DSO | GlobalPlanet | Star, coords: EquatorialCoordinate) => {
      if (!Number.isFinite(coords.ra) || !Number.isFinite(coords.dec)) return;

      let visibilityCount = 0;
      let peakAltitude = -Infinity;
      for (const phase of phases) {
        if (!isBodyAboveHorizon(phase, OBSERVER, coords, effectiveMinAltitude)) continue;
        const { alt } = convertEquatorialToHorizontal(phase, OBSERVER, coords);
        if (alt < effectiveMinAltitude || alt > effectiveMaxAltitude) continue;
        visibilityCount++;
        if (alt > peakAltitude) peakAltitude = alt;
      }

      if (visibilityCount > 0) {
        visibleObjects.set(object, {
          count: visibilityCount,
          maxAlt: peakAltitude,
          magnitude: getMagnitude(object),
          categoryPriority: getCategoryPriority(object),
          dsoTypePriority: getDsoTypePriority(object)
        });
      }
    };

    if (params.objects.dso) {
      for (const dso of preFilteredDSOs) {
        const ra = convertHMSToDegreeFromString(dso.ra);
        const dec = convertDMSToDegreeFromString(dso.dec);
        if (!Number.isFinite(ra) || !Number.isFinite(dec)) continue;
        addVisibility(dso, { ra, dec });
      }
    }

    if (params.objects.stars) {
      for (const star of preFilteredStars) {
        if (!Number.isFinite(star.ra) || !Number.isFinite(star.dec)) continue;
        addVisibility(star, { ra: star.ra, dec: star.dec });
      }
    }

    if (params.objects.planets) {
      for (const planet of params.planetsCatalog) {
        if (!Number.isFinite(planet.ra) || !Number.isFinite(planet.dec)) continue;
        addVisibility(planet, { ra: planet.ra, dec: planet.dec });
      }
    }

    const sortedVisibleObjects = Array.from(visibleObjects.entries()).sort((a, b) => {
      const infoA = a[1];
      const infoB = b[1];
      const magA = infoA.magnitude ?? Number.POSITIVE_INFINITY;
      const magB = infoB.magnitude ?? Number.POSITIVE_INFINITY;
      const bothAreDsoOrStar = infoA.categoryPriority <= 1 && infoB.categoryPriority <= 1;

      if (infoA.categoryPriority !== infoB.categoryPriority) return infoB.categoryPriority - infoA.categoryPriority;
      if (infoA.categoryPriority === 1 && infoB.categoryPriority === 1 && infoA.dsoTypePriority !== infoB.dsoTypePriority) {
        return infoB.dsoTypePriority - infoA.dsoTypePriority;
      }
      if (bothAreDsoOrStar && magA !== magB) return magA - magB;
      if (infoA.count !== infoB.count) return infoB.count - infoA.count;
      if (infoA.maxAlt !== infoB.maxAlt) return infoB.maxAlt - infoA.maxAlt;
      if (magA !== magB) return magA - magB;
      return 0;
    });
    const observationLimit = Math.max(0, Math.floor(OBS_COUNT_LIMIT));
    const maxResultsLimit = params.maxResults ?? Number.POSITIVE_INFINITY;
    const selectionLimit = Math.min(observationLimit || maxResultsLimit, maxResultsLimit, sortedVisibleObjects.length);

    RESULTS_CATALOG.push(...sortedVisibleObjects.slice(0, selectionLimit).map(([object]) => object));


  } catch (error) {
    console.log(`[planObservationNight] Erreur lors de la planification de la nuit d'observation : ${error}`);
  }

  return RESULTS_CATALOG;
};
