import { auth } from "../../../../firebaseConfig";
import { RadarData } from "../../../types/weather/Radar";

// /v3/weather/radar : pas de query params. Protégée par checkCallFromApp car la tuile "clouds"
// contient la clé OpenWeatherMap en clair (voulu — c'est comme ça qu'OWM attend qu'on utilise ses
// tuiles côté client, d'où la protection de la route plutôt que de la clé elle-même).
export const getWeatherRadar = async (): Promise<RadarData | null> => {
  try {
    console.log(`[getWeatherRadar] Fetching radar data`);

    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/weather/radar`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
    });

    if (!response.ok) {
      console.log(`[getWeatherRadar] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json() as RadarData;
  } catch (error) {
    console.log(`[getWeatherRadar] Error: ${error}`);
    return null;
  }
}
