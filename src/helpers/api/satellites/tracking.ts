import { SatellitePasses, SatellitePositions, SatelliteTle } from "../../../types/satellites/SatelliteTracking";

const BASE_URL = `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite`;

// Les 3 routes /v3/satellite/* acceptent soit noradId, soit name (résolu via le catalogue NORAD,
// recherche partielle) — jamais les deux à la fois côté appelant.
export type SatelliteIdentifier = { noradId: number } | { name: string };

const identifierParams = (identifier: SatelliteIdentifier): URLSearchParams => {
  const params = new URLSearchParams();
  if ("noradId" in identifier) params.set("noradId", String(identifier.noradId));
  else params.set("name", identifier.name);
  return params;
};

export const getSatelliteTle = async (identifier: SatelliteIdentifier): Promise<SatelliteTle | null> => {
  try {
    const params = identifierParams(identifier);
    console.log(`[getSatelliteTle] Fetching TLE for ${params.toString()}`);

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      console.log(`[getSatelliteTle] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as SatelliteTle;
  } catch (error) {
    console.log(`[getSatelliteTle] Error: ${error}`);
    return null;
  }
};

interface GetSatellitePositionParams {
  identifier: SatelliteIdentifier;
  latitude: number;
  longitude: number;
  altitude?: number; // mètres, défaut 0
  seconds?: number; // défaut 1, max 300
}

export const getSatellitePosition = async ({
  identifier,
  latitude,
  longitude,
  altitude = 0,
  seconds = 1,
}: GetSatellitePositionParams): Promise<SatellitePositions | null> => {
  try {
    const params = identifierParams(identifier);
    params.set("lat", String(latitude));
    params.set("lon", String(longitude));
    params.set("altitude", String(altitude));
    params.set("seconds", String(seconds));
    console.log(`[getSatellitePosition] Fetching position for ${params.toString()}`);

    const response = await fetch(`${BASE_URL}/position?${params.toString()}`);
    if (!response.ok) {
      console.log(`[getSatellitePosition] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as SatellitePositions;
  } catch (error) {
    console.log(`[getSatellitePosition] Error: ${error}`);
    return null;
  }
};

interface GetSatellitePassesParams {
  identifier: SatelliteIdentifier;
  latitude: number;
  longitude: number;
  altitude?: number; // mètres, défaut 0
  days?: number; // défaut 10, max 10
  minVisibility?: number; // secondes, défaut 30, max 300
}

export const getSatellitePasses = async ({
  identifier,
  latitude,
  longitude,
  altitude = 0,
  days = 10,
  minVisibility = 30,
}: GetSatellitePassesParams): Promise<SatellitePasses | null> => {
  try {
    const params = identifierParams(identifier);
    params.set("lat", String(latitude));
    params.set("lon", String(longitude));
    params.set("altitude", String(altitude));
    params.set("days", String(days));
    params.set("minVisibility", String(minVisibility));
    console.log(`[getSatellitePasses] Fetching passes for ${params.toString()}`);

    const response = await fetch(`${BASE_URL}/passes?${params.toString()}`);
    if (!response.ok) {
      console.log(`[getSatellitePasses] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as SatellitePasses;
  } catch (error) {
    console.log(`[getSatellitePasses] Error: ${error}`);
    return null;
  }
};
