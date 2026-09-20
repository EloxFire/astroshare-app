import i18next from "../../../i18n";

const BASE_URL = process.env.EXPO_PUBLIC_ASTROSHARE_API_URL;

export const getLocationNameFromCoords = async (latitude: number, longitude: number): Promise<{
  name: string;
  local_names: Record<string, string>;
  country: string;
  state: string;
} | null> => {
  try {
    const response = await fetch(`${BASE_URL}/location/name?lat=${latitude}&lon=${longitude}`);
    if (!response.ok) {
      throw new Error(`[getLocationNameFromCoords] HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    return {
      name: data.data.name,
      local_names: data.data.local_names,
      country: data.data.country,
      state: data.data.state
    }
  } catch (error) {
    console.log("[getLocationNameFromCoords] Error fetching location name:", error);
    return null;
  }
};

export const getLocationCoordsFromName = async (name: string): Promise<{
  latitude: number;
  longitude: number;
  elevation: number | null;
  local_names: Record<string, string>;
  country: string;
  state: string;
  name: string;
} | null> => {
  try {
    const response = await fetch(`${BASE_URL}/location/coords?name=${name}`);
    if (!response.ok) {
      throw new Error(`[getLocationCoordsFromName] HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log("[getLocationCoordsFromName] Fetched location coordinates:");
    return {
      latitude: data.data.lat,
      longitude: data.data.lon,
      elevation: null, // The geocoding API does not provide elevation, so we set it to null
      local_names: data.data.local_names,
      country: data.data.country,
      state: data.data.state,
      name: data.data.name
    }
    
  } catch (error) {
    console.error("[getLocationCoordsFromName] Error fetching location coordinates:", error);
    return null;
  }
};

// Échelle de Bortle (1-9, du ciel le plus noir au plus pollué) :
// 1 = Excellent ciel noir       6 = Ciel de banlieue éclairée
// 2 = Ciel noir typique         7 = Transition banlieue/ville
// 3 = Ciel « rural »            8 = Ciel urbain
// 4 = Transition rural/périurbain   9 = Ciel de centre-ville
// 5 = Ciel de banlieue
export const getLightPollutionDataFromCoords = async (latitude: number, longitude: number): Promise<{
  bortle: number;
  mpsas: number;
  source: string;
} | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lightpollution?lat=${latitude}&lon=${longitude}`);
    if (!response.ok) {
      throw new Error(`[getLightPollutionDataFromCoords] HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      bortle: data.bortle,
      mpsas: data.mpsas,
      source: data.source,
    }
  } catch (error) {
    console.error("[getLightPollutionDataFromCoords] Error fetching light pollution data:", error);
    return null;
  }
};

// Traduit un niveau Bortle (1-9) en libellé — voir l'échelle ci-dessus et les clés
// addObservatory.lightPollution.indicators.<1-9> dans settings.json. Pas de champ `indicator`
// stocké dans getLightPollutionData : `bortle` est déjà l'identifiant stable, la traduction se
// fait uniquement à l'affichage (même principe que Phase côté observerly, voir
// getLunarPhaseLabel dans moonHelpers.ts — éviter de figer la langue dans une donnée stockée).
export const getLightPollutionIndicatorLabel = (bortle: number): string =>
  i18next.t(`lightPollution.indicators.${bortle}`, { ns: "common" });

export const getLightPollutionIndicatorDescription = (bortle: number): string =>
  i18next.t(`lightPollution.indicatorDescriptions.${bortle}`, { ns: "common" });