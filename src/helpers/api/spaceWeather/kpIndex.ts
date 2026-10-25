import { KpData } from "../../../types/spaceWeather/KpIndex";

export const getKpIndex = async (): Promise<KpData | null> => {
  try {
    console.log(`[getKpIndex] Fetching Kp index data`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/kpi`);
    if (!response.ok) {
      console.log(`[getKpIndex] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as KpData;
  } catch (error) {
    console.log(`[getKpIndex] Error: ${error}`);
    return null;
  }
}
