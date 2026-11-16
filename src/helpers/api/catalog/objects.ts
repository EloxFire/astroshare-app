import { CatalogObjectCategory, CatalogObjectDetail, CatalogObjectKind, CatalogObjectListResponse, CatalogObjectSummary } from "../../../types/catalog/CatalogObject";

// /v3/objects (public, pas d'auth) — remplace entièrement /v3/messier, /v3/ngc, /v3/ic, /v3/dso,
// /v3/stars, /v3/search, qui n'existent plus sous /v3.

export type ListObjectsParams = {
  kind?: CatalogObjectKind; // ex: "solar_system" pour ne lister que Soleil, Lune et planètes
  category?: CatalogObjectCategory;
  type?: string; // libre, pas de validation côté serveur
  // Magnitude visuelle maximale. Exclut d'office les objets du système solaire (magnitude null).
  maxMag?: number;
  // Boîte du ciel en degrés ; raMin > raMax = boîte qui traverse 0°/360°, géré côté serveur.
  // Exclut d'office les objets du système solaire (position null).
  bbox?: { raMin: number; raMax: number; decMin: number; decMax: number };
  page?: number; // défaut serveur : 1
  limit?: number; // défaut serveur : 200, max 2000
};

// Liste paginée/filtrée (rendu de catalogue, ou rendu du ciel filtré par magnitude/zone). Ne jamais
// itérer `page` jusqu'à épuisement pour tout charger côté front : filtrer par maxMag/bbox/kind en
// amont, voir les notes de l'API.
export const listObjects = async (params: ListObjectsParams = {}): Promise<CatalogObjectListResponse | null> => {
  try {
    const query = new URLSearchParams();
    if (params.kind) query.set("kind", params.kind);
    if (params.category) query.set("category", params.category);
    if (params.type) query.set("type", params.type);
    if (params.maxMag != null) query.set("maxMag", params.maxMag.toString());
    if (params.bbox) query.set("bbox", `${params.bbox.raMin},${params.bbox.raMax},${params.bbox.decMin},${params.bbox.decMax}`);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/objects?${query.toString()}`);
    if (!response.ok) {
      console.log(`[listObjects] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json() as CatalogObjectListResponse;
  } catch (error) {
    console.log(`[listObjects] Error: ${error}`);
    return null;
  }
}

// Recherche par nom/désignation ("m42", "ngc 1976", "betelgeuse", "hip 69673"...). Le serveur ne
// throttle rien : debouncer côté appelant (voir useObjectSearch). Tri déjà fait côté serveur, ne pas
// retrier côté front : correspondance exacte avant préfixe, puis par kind (solar_system, dso, star,
// small_body), puis magnitude croissante (magnitudes null en fin de groupe). `limit` : 20 par défaut
// côté serveur, 50 au maximum.
export const searchObjects = async (query: string, limit?: number): Promise<CatalogObjectSummary[] | null> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const params = new URLSearchParams({ q: trimmedQuery });
    if (limit) params.set("limit", limit.toString());

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/objects/search?${params.toString()}`);
    if (!response.ok) {
      console.log(`[searchObjects] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as CatalogObjectSummary[];
  } catch (error) {
    console.log(`[searchObjects] Error: ${error}`);
    return null;
  }
}

// Fiche complète. `id` doit être l'identifiant stable exact (ex: "NGC1976", "HIP69673", "SS-MARS"),
// sensible à la casse — pas de recherche floue ici, passer par searchObjects pour ça. null si l'id
// n'existe pas (404). Le bloc propre au kind (dso, star, solar_system) n'est présent que pour ce kind.
export const getObjectById = async (id: string): Promise<CatalogObjectDetail | null> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/objects/${encodeURIComponent(id)}`);
    if (!response.ok) {
      console.log(`[getObjectById] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as CatalogObjectDetail;
  } catch (error) {
    console.log(`[getObjectById] Error: ${error}`);
    return null;
  }
}
