import { SolarWeatherOutlookData } from "../../../types/spaceWeather/SolarWeatherOutlook";

export const getSolarWeatherOutlook = async (): Promise<SolarWeatherOutlookData | null> => {
  try {
    console.log(`[getSolarWeatherOutlook] Fetching solar weather outlook`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/outlook`);
    if (!response.ok) {
      console.log(`[getSolarWeatherOutlook] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as SolarWeatherOutlookData;
  } catch (error) {
    console.log(`[getSolarWeatherOutlook] Error: ${error}`);
    return null;
  }
}
