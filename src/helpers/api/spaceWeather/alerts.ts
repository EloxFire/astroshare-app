import { SpaceWeatherAlertsData } from "../../../types/spaceWeather/SpaceWeatherAlerts";

export const getSpaceWeatherAlerts = async (): Promise<SpaceWeatherAlertsData | null> => {
  try {
    console.log(`[getSpaceWeatherAlerts] Fetching space weather alerts`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/alerts`);
    if (!response.ok) {
      console.log(`[getSpaceWeatherAlerts] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as SpaceWeatherAlertsData;
  } catch (error) {
    console.log(`[getSpaceWeatherAlerts] Error: ${error}`);
    return null;
  }
}
