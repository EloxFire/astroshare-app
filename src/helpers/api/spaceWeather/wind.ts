import { SolarWindData } from "../../../types/spaceWeather/SolarWind";

export const getSolarWind = async (): Promise<SolarWindData | null> => {
  try {
    console.log(`[getSolarWind] Fetching solar wind data`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/wind`);
    if (!response.ok) {
      console.log(`[getSolarWind] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as SolarWindData;
  } catch (error) {
    console.log(`[getSolarWind] Error: ${error}`);
    return null;
  }
}
