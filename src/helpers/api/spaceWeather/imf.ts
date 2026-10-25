import { ImfData } from "../../../types/spaceWeather/InterplanetaryMagneticField";

export const getImf = async (): Promise<ImfData | null> => {
  try {
    console.log(`[getImf] Fetching interplanetary magnetic field data`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/solarweather/imf`);
    if (!response.ok) {
      console.log(`[getImf] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json() as ImfData;
  } catch (error) {
    console.log(`[getImf] Error: ${error}`);
    return null;
  }
}
