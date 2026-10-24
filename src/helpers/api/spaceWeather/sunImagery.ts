import { SunImagery } from "../../../types/spaceWeather/SunImagery";

// imageUrl/animationUrl sont des liens CDN NASA/NOAA directs (toujours à jour) : on ne les
// télécharge jamais via ce helper, le device les charge lui-même (Image/VideoView).
export const getSunImagery = async (): Promise<SunImagery | null> => {
  try {
    console.log(`[getSunImagery] Fetching sun imagery`);
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/sun`);
    if (!response.ok) {
      console.log(`[getSunImagery] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as SunImagery;
  } catch (error) {
    console.log(`[getSunImagery] Error: ${error}`);
    return null;
  }
}
