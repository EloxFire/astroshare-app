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
  dsoSubTypes?: {
    galaxies: boolean;
    nebulae: boolean;
    globularClusters: boolean;
    openClusters: boolean;
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

type DsoSubTypeKey = keyof NonNullable<ObservationPlannerParams['dsoSubTypes']>;

const DSO_TYPE_CATEGORIES: Record<string, DsoSubTypeKey[]> = {
  'G':      ['galaxies'],
  'GGroup': ['galaxies'],
  'GPair':  ['galaxies'],
  'GTrpl':  ['galaxies'],
  'Neb':    ['nebulae'],
  'HII':    ['nebulae'],
  'PN':     ['nebulae'],
  'SNR':    ['nebulae'],
  'RfN':    ['nebulae'],
  'DRKN':   ['nebulae'],
  'GCl':    ['globularClusters'],
  'OCl':    ['openClusters'],
  'Cl+N':   ['openClusters', 'nebulae'],
};

export interface PlannerResult {
  object: DSO | GlobalPlanet | Star;
  settingMinute: number;  // minutes from session start when object sets (Infinity = circumpolar)
  risingMinute: number;   // minutes from session start when object rises (0 = already above horizon)
  currentAlt: number;     // altitude in degrees at session start
  magnitude: number | null;
}

export const planObservationNight = async (params: ObservationPlannerParams): Promise<PlannerResult[]> => {
  // Some constants
  const DEFAULT_OBS_TIME_PER_OBJECT = params.perObjectObsTime || 5; // in minutes
  const OBSERVER: GeographicCoordinate = { latitude: params.location.latitude, longitude: params.location.longitude };
  const MINIMUM_ALTITUDE_DEGREE = 5; // Minimum altitude to consider an object visible
  const MAXIMUM_ALTITUDE_DEGREE = 90; // Maximum altitude to consider an object visible
  const OBS_WINDOW_TIME_MINUTES = params.date.endTime.diff(params.date.startTime, 'minute'); // Total observation window in minutes
  const OBS_COUNT_LIMIT = OBS_WINDOW_TIME_MINUTES / DEFAULT_OBS_TIME_PER_OBJECT; // Max number of objects that can be observed in the given time
  const RESULTS_CATALOG: PlannerResult[] = [];


  try {
    let preFilteredDSOs: DSO[] = [];
    if(params.objects.dso){
      preFilteredDSOs = params.dsoCatalog.filter((dso: DSO) => {
        // Skip stellar objects catalogued in DSO catalogs (stars, double stars, asterisms)
        const typeRaw = dso.type || '';
        if (typeRaw === '*' || typeRaw === '**' || typeRaw.toLowerCase() === '*ass') return false;

        // Magnitude filter
        if(typeof dso.v_mag === 'string') return false;
        if(params.magnitude.min !== null && dso.v_mag < params.magnitude.min) return false;
        if(params.magnitude.max !== null && dso.v_mag > params.magnitude.max) return false;

        // DSO sub-type filter
        if (params.dsoSubTypes) {
          const sub = params.dsoSubTypes;
          const anyEnabled = sub.galaxies || sub.nebulae || sub.globularClusters || sub.openClusters;
          if (!anyEnabled) return false;
          const categories = DSO_TYPE_CATEGORIES[dso.type];
          if (categories && !categories.some(cat => sub[cat])) return false;
        }

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

    // Sample every 15 minutes to track altitude profile and setting time accurately
    const SAMPLE_STEP_MINUTES = 15;
    const numSamples = Math.max(3, Math.ceil(OBS_WINDOW_TIME_MINUTES / SAMPLE_STEP_MINUTES) + 1);
    const phases: { date: Date; minuteOffset: number }[] = Array.from({ length: numSamples }, (_, i) => {
      const minuteOffset = Math.min(i * SAMPLE_STEP_MINUTES, OBS_WINDOW_TIME_MINUTES);
      return { date: params.date.startTime.add(minuteOffset, 'minute').toDate(), minuteOffset };
    });

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

    type VisibilityInfo = { count: number; maxAlt: number; magnitude: number | null; categoryPriority: number; dsoTypePriority: number; settingMinute: number; risingMinute: number; currentAlt: number };
    const visibleObjects = new Map<DSO | GlobalPlanet | Star, VisibilityInfo>();

    // Single 5-min scan with linear interpolation to find both rising and setting times.
    // Searches up to 4h past the observation window so objects set after the session end
    // still receive a finite, comparable settingMinute rather than Infinity.
    const TRANSITION_STEP = 5;
    const TRANSITION_SEARCH_MINUTES = OBS_WINDOW_TIME_MINUTES + 4 * 60;

    const findTransitions = (coords: EquatorialCoordinate): { startAlt: number; settingMinute: number; risingMinute: number } => {
      const startAlt = convertEquatorialToHorizontal(params.date.startTime.toDate(), OBSERVER, coords).alt;
      let settingMinute = Number.POSITIVE_INFINITY;
      let risingMinute = startAlt >= effectiveMinAltitude ? 0 : Number.POSITIVE_INFINITY;
      let prevAlt = startAlt;

      for (let m = TRANSITION_STEP; m <= TRANSITION_SEARCH_MINUTES; m += TRANSITION_STEP) {
        const { alt } = convertEquatorialToHorizontal(params.date.startTime.add(m, 'minute').toDate(), OBSERVER, coords);

        if (risingMinute === Number.POSITIVE_INFINITY && prevAlt < effectiveMinAltitude && alt >= effectiveMinAltitude) {
          const fraction = (effectiveMinAltitude - prevAlt) / (alt - prevAlt);
          risingMinute = (m - TRANSITION_STEP) + fraction * TRANSITION_STEP;
        }

        if (settingMinute === Number.POSITIVE_INFINITY && prevAlt >= effectiveMinAltitude && alt < effectiveMinAltitude) {
          const fraction = (prevAlt - effectiveMinAltitude) / (prevAlt - alt);
          settingMinute = (m - TRANSITION_STEP) + fraction * TRANSITION_STEP;
        }

        if (Number.isFinite(risingMinute) && Number.isFinite(settingMinute)) break;
        prevAlt = alt;
      }

      return { startAlt, settingMinute, risingMinute };
    };

    const addVisibility = (object: DSO | GlobalPlanet | Star, coords: EquatorialCoordinate) => {
      if (!Number.isFinite(coords.ra) || !Number.isFinite(coords.dec)) return;

      let visibilityCount = 0;
      let peakAltitude = -Infinity;

      for (const { date } of phases) {
        if (!isBodyAboveHorizon(date, OBSERVER, coords, effectiveMinAltitude)) continue;
        const { alt } = convertEquatorialToHorizontal(date, OBSERVER, coords);
        if (alt < effectiveMinAltitude || alt > effectiveMaxAltitude) continue;
        visibilityCount++;
        if (alt > peakAltitude) peakAltitude = alt;
      }

      if (visibilityCount > 0) {
        const { startAlt, settingMinute, risingMinute } = findTransitions(coords);
        visibleObjects.set(object, {
          count: visibilityCount,
          maxAlt: peakAltitude,
          magnitude: getMagnitude(object),
          categoryPriority: getCategoryPriority(object),
          dsoTypePriority: getDsoTypePriority(object),
          settingMinute,
          risingMinute,
          currentAlt: startAlt,
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

      // Primary: objects setting soonest come first (observe before they disappear)
      const aFinite = Number.isFinite(infoA.settingMinute);
      const bFinite = Number.isFinite(infoB.settingMinute);
      if (aFinite !== bFinite) return aFinite ? -1 : 1;
      if (aFinite && infoA.settingMinute !== infoB.settingMinute) return infoA.settingMinute - infoB.settingMinute;

      // For objects with equal setting time: category, then type, then magnitude, then altitude
      if (infoA.categoryPriority !== infoB.categoryPriority) return infoB.categoryPriority - infoA.categoryPriority;
      if (infoA.categoryPriority === 1 && infoB.categoryPriority === 1 && infoA.dsoTypePriority !== infoB.dsoTypePriority) {
        return infoB.dsoTypePriority - infoA.dsoTypePriority;
      }
      if (magA !== magB) return magA - magB;
      if (infoA.maxAlt !== infoB.maxAlt) return infoB.maxAlt - infoA.maxAlt;
      return 0;
    });
    const observationLimit = Math.max(0, Math.floor(OBS_COUNT_LIMIT));
    const maxResultsLimit = params.maxResults ?? Number.POSITIVE_INFINITY;
    const selectionLimit = Math.min(observationLimit || maxResultsLimit, maxResultsLimit, sortedVisibleObjects.length);

    RESULTS_CATALOG.push(...sortedVisibleObjects.slice(0, selectionLimit).map(([object, info]) => ({
      object,
      settingMinute: info.settingMinute,
      risingMinute: info.risingMinute,
      currentAlt: info.currentAlt,
      magnitude: info.magnitude,
    })));


  } catch (error) {
    console.log(`[planObservationNight] Erreur lors de la planification de la nuit d'observation : ${error}`);
  }

  return RESULTS_CATALOG as PlannerResult[];
};
