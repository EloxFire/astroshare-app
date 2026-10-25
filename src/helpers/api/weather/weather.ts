import { auth } from "../../../../firebaseConfig";
import { WeatherData } from "../../../types/weather/Weather";

// /v3/weather exige une authentification (Authorization: Bearer <token Firebase ou ADMIN_KEY>) —
// premier helper de l'app à en avoir besoin. `auth` est le singleton Firebase déjà utilisé par
// AuthContext (importable tel quel depuis un helper non-composant, pas besoin de hook/contexte).
// Si personne n'est connecté, `auth.currentUser` est `null` : l'appel part alors sans en-tête
// Authorization et laisse l'API répondre 401 plutôt que d'improviser un repli (ex: ADMIN_KEY, une
// clé admin qui n'a pas sa place dans un appel utilisateur normal).
export const getWeather = async (
  latitude?: number,
  longitude?: number,
  lang?: string
): Promise<WeatherData | null> => {
  if (latitude == null || longitude == null) {
    console.log(`[getWeather] Error: latitude/longitude manquants`);
    return null;
  }

  try {
    console.log(`[getWeather] Fetching weather data`);

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
    });
    if (lang) params.set("lang", lang);

    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/weather?${params.toString()}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
    });

    if (!response.ok) {
      console.log(`[getWeather] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as WeatherData;
  } catch (error) {
    console.log(`[getWeather] Error: ${error}`);
    return null;
  }
}
