import { convertEquatorialToHorizontal, EquatorialCoordinate, GeographicCoordinate } from "@observerly/astrometry";
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
  perObjectObsTime?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  date: {
    start: Dayjs;
    end: Dayjs;
    startTime: Dayjs;
    endTime: Dayjs;
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
  const latitude = params.location.latitude ?? (params.location as any).lat;
  const longitude = params.location.longitude ?? (params.location as any).lon;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    console.warn("[Observation Planner] Missing observer coordinates.");
    return [];
  }

  const observer: GeographicCoordinate = { latitude, longitude };
  const windowMinutes = Math.max(1, params.date.endTime.diff(params.date.startTime, "minute"));
  const stepMinutes = Math.min(30, Math.max(5, Math.floor(windowMinutes / 12) || 5));
  const perObjectObsTimeMinutes = Math.max(1, params.perObjectObsTime ?? 5);
  const sampleTimes: Date[] = [];

  for (let minutes = 0; minutes <= windowMinutes; minutes += stepMinutes) {
    sampleTimes.push(params.date.startTime.add(minutes, "minute").toDate());
  }

  const endDate = params.date.endTime.toDate();
  if (sampleTimes.length === 0 || sampleTimes[sampleTimes.length - 1].getTime() !== endDate.getTime()) {
    sampleTimes.push(endDate);
  }

  const altitudeMin = params.altitude.min ?? 0;
  const altitudeMax = params.altitude.max ?? 90;
  const useAltitudeMax = params.altitude.max !== null;

  type ScoredObservation = {
    object: DSO | GlobalPlanet | Star;
    maxAltitude: number;
    visibleCount: number;
    magnitude: number | null;
    firstVisible: Date;
    lastVisible: Date;
  };

  const scoredResults: ScoredObservation[] = [];

  const passesMagnitude = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) {
      return params.magnitude.min === null && params.magnitude.max === null;
    }
    if (params.magnitude.min !== null && value < params.magnitude.min) return false;
    if (params.magnitude.max !== null && value > params.magnitude.max) return false;
    return true;
  };

  const evaluateObject = (object: DSO | GlobalPlanet | Star, coords: EquatorialCoordinate, magnitude?: number) => {
    if (!passesMagnitude(magnitude)) {
      return;
    }

    let visibleCount = 0;
    let maxAltitude = Number.NEGATIVE_INFINITY;
    let firstVisible: Date | null = null;
    let lastVisible: Date | null = null;

    for (const moment of sampleTimes) {
      const { alt } = convertEquatorialToHorizontal(moment, observer, coords);
      if (alt > maxAltitude) {
        maxAltitude = alt;
      }
      if (alt >= altitudeMin && (!useAltitudeMax || alt <= altitudeMax)) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = moment;
        lastVisible = moment;
      }
    }

    if (visibleCount === 0) return;

    scoredResults.push({
      object,
      maxAltitude,
      visibleCount,
      magnitude: magnitude ?? null,
      firstVisible: firstVisible as Date,
      lastVisible: lastVisible as Date,
    });
  };

  if (params.objects.dso) {
    for (const dso of params.dsoCatalog) {
      if (!dso.ra || !dso.dec) {
        console.log("[Observation Planner] DSO missing coordinates:", dso.name || dso.identifiers || "Unknown", "skipping.");
        continue;
      }

      const ra = typeof dso.ra === "number" ? dso.ra : convertHMSToDegreeFromString(dso.ra);
      const dec = typeof dso.dec === "number" ? dso.dec : convertDMSToDegreeFromString(dso.dec);
      const vMag = typeof dso.v_mag === "number" ? dso.v_mag : parseFloat(dso.v_mag as string);
      if (Number.isNaN(ra) || Number.isNaN(dec)) continue;

      evaluateObject(dso, { ra, dec }, Number.isNaN(vMag) ? undefined : vMag);
    }
  }

  if (params.objects.stars) {
    for (const star of params.starsCatalog) {
      const magnitude = star.V;
      evaluateObject(star, { ra: star.ra, dec: star.dec }, Number.isNaN(magnitude) ? undefined : magnitude);
    }
  }

  if (params.objects.planets) {
    for (const planet of params.planetsCatalog) {
      evaluateObject(planet, { ra: planet.ra, dec: planet.dec }, getPlanetMagnitude(planet.name));
    }
  }

  console.log(`[Observation Planner] Found ${scoredResults.length} objects matching criteria.`);
  /* END OF PHASE 1 */

  const magnitudeOrInfinity = (value: number | null) => (value === null ? Number.POSITIVE_INFINITY : value);
  const timeOrInfinity = (value: Date | null | undefined) => (value ? value.getTime() : Number.POSITIVE_INFINITY);
  const getName = (obj: DSO | GlobalPlanet | Star) => {
    if ("name" in obj && obj.name) return String(obj.name);
    if ("identifiers" in obj && (obj as any).identifiers) return String((obj as any).identifiers);
    if ("designation" in obj && (obj as any).designation) return String((obj as any).designation);
    return "";
  };

  const getCategory = (obj: DSO | GlobalPlanet | Star): "dso" | "planet" | "star" | "unknown" => {
    if ("V" in obj) return "star";
    if ("type" in obj) return "dso";
    if ("name" in obj) return "planet";
    return "unknown";
  };

  const compareByVisibilityAndMagnitude = (a: ScoredObservation, b: ScoredObservation) => {
    const lastVisibleDelta = timeOrInfinity(a.lastVisible) - timeOrInfinity(b.lastVisible);
    if (lastVisibleDelta !== 0) return lastVisibleDelta;

    const firstVisibleDelta = timeOrInfinity(a.firstVisible) - timeOrInfinity(b.firstVisible);
    if (firstVisibleDelta !== 0) return firstVisibleDelta;

    if (b.visibleCount !== a.visibleCount) return b.visibleCount - a.visibleCount;
    const magnitudeDelta = magnitudeOrInfinity(a.magnitude) - magnitudeOrInfinity(b.magnitude);
    if (magnitudeDelta !== 0) return magnitudeDelta;

    if (b.maxAltitude !== a.maxAltitude) return b.maxAltitude - a.maxAltitude;

    const aName = getName(a.object);
    const bName = getName(b.object);
    return aName.localeCompare(bName);
  };

  const buckets: Record<ReturnType<typeof getCategory>, ScoredObservation[]> = {
    dso: [],
    planet: [],
    star: [],
    unknown: [],
  };

  for (const result of scoredResults) {
    buckets[getCategory(result.object)].push(result);
  }

  Object.values(buckets).forEach(bucket => bucket.sort(compareByVisibilityAndMagnitude));

  const windowSlots = Math.max(1, Math.floor(windowMinutes / perObjectObsTimeMinutes));
  const maxResults = Math.min(params.maxResults ?? 10, windowSlots);
  const selectedObjects: (DSO | GlobalPlanet | Star)[] = [];

  type BucketEntry = {
    type: ReturnType<typeof getCategory>;
    items: ScoredObservation[];
    index: number;
  };

  const bucketQueue: BucketEntry[] = (["dso", "planet", "star", "unknown"] as const)
    .map(type => ({ type, items: buckets[type], index: 0 }))
    .filter(entry => entry.items.length > 0);

  let lastSelectedType: ReturnType<typeof getCategory> | null = null;

  while (selectedObjects.length < maxResults && bucketQueue.length > 0) {
    const availableBuckets = bucketQueue.filter(entry => entry.index < entry.items.length);
    if (availableBuckets.length === 0) break;

    const candidateBuckets = availableBuckets.filter(entry => entry.type !== lastSelectedType);
    const pool = candidateBuckets.length > 0 ? candidateBuckets : availableBuckets;

    const chosenBucket = pool.reduce<BucketEntry | null>((best, entry) => {
      if (!best) return entry;
      const bestTime = timeOrInfinity(best.items[best.index]?.lastVisible);
      const entryTime = timeOrInfinity(entry.items[entry.index]?.lastVisible);
      return entryTime < bestTime ? entry : best;
    }, null);

    if (!chosenBucket) break;

    selectedObjects.push(chosenBucket.items[chosenBucket.index].object);
    chosenBucket.index += 1;
    lastSelectedType = chosenBucket.type;

    for (let i = bucketQueue.length - 1; i >= 0; i -= 1) {
      if (bucketQueue[i].index >= bucketQueue[i].items.length) {
        bucketQueue.splice(i, 1);
      }
    }
  }

  return selectedObjects;
};
