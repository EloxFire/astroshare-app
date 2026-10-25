import { SolarFlaresData } from "../../../types/spaceWeather/SolarFlares";

export const getSolarFlares = async (): Promise<SolarFlaresData | null> => {
  try {
    console.log(`[getSolarFlares] Fetching solar flares data`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/flares`);
    if (!response.ok) {
      console.log(`[getSolarFlares] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as SolarFlaresData;
  } catch (error) {
    console.log(`[getSolarFlares] Error: ${error}`);
    return null;
  }
}
