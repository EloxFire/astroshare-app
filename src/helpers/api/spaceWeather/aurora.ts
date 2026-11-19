import { AuroraForecast } from "../../../types/spaceWeather/AuroraForecast";

// lat/lon optionnels (et vont ensemble) : sans eux, pas de champ `here` dans la réponse — seulement
// les images globales (ovation/dashboard nord et sud).
export const getAuroraForecast = async (latitude?: number, longitude?: number): Promise<AuroraForecast | null> => {
  try {
    console.log(`[getAuroraForecast] Fetching aurora forecast`);

    const params = latitude !== undefined && longitude !== undefined
      ? `?lat=${latitude}&lon=${longitude}`
      : "";
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/aurora${params}`);
    if (!response.ok) {
      console.log(`[getAuroraForecast] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as AuroraForecast;
  } catch (error) {
    console.log(`[getAuroraForecast] Error: ${error}`);
    return null;
  }
}
