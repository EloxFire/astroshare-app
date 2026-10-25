import { auth } from "../../../../firebaseConfig";
import { AstroConditionsData } from "../../../types/weather/AstroConditions";

// /v3/weather/astro (7Timer, gratuit, sans SLA) échoue indépendamment de /v3/weather — timeout 8s,
// 502 si 7Timer ne répond pas. Un appelant doit donc gérer `null` ici même quand getWeather() a
// réussi à côté.
export const getAstroConditions = async (
  latitude?: number,
  longitude?: number
): Promise<AstroConditionsData | null> => {
  if (latitude == null || longitude == null) {
    console.log(`[getAstroConditions] Error: latitude/longitude manquants`);
    return null;
  }

  try {
    console.log(`[getAstroConditions] Fetching astro conditions`);

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
    });

    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/weather/astro?${params.toString()}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
    });

    if (!response.ok) {
      console.log(`[getAstroConditions] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    // Pas d'enveloppe { data: ... } ici contrairement à getWeather — modelRun/data sont déjà au
    // premier niveau de la réponse.
    return await response.json() as AstroConditionsData;
  } catch (error) {
    console.log(`[getAstroConditions] Error: ${error}`);
    return null;
  }
}
