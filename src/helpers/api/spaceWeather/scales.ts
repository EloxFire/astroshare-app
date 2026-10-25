import { NoaaScalesData } from "../../../types/spaceWeather/NoaaScales";

export const getNoaaScales = async (): Promise<NoaaScalesData | null> => {
  try {
    console.log(`[getNoaaScales] Fetching NOAA scales data`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/scales`);
    if (!response.ok) {
      console.log(`[getNoaaScales] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as NoaaScalesData;
  } catch (error) {
    console.log(`[getNoaaScales] Error: ${error}`);
    return null;
  }
}
