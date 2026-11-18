import { NoradSatellite } from "../../../types/satellites/NoradSatellite";

const BASE_URL = `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/norad`;

// GET /v3/norad/:noradId accepte un id NORAD ou un bout de nom, insensible à la casse et en
// correspondance partielle : il peut donc renvoyer plusieurs résultats (ex: "starlink"). 404 si
// aucun match, traité comme un tableau vide plutôt que comme une erreur.
export const findNoradSatellites = async (query: string | number): Promise<NoradSatellite[] | null> => {
  try {
    console.log(`[findNoradSatellites] Fetching norad query ${query}`);

    const response = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`);
    if (response.status === 404) return [];
    if (!response.ok) {
      console.log(`[findNoradSatellites] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as NoradSatellite[];
  } catch (error) {
    console.log(`[findNoradSatellites] Error: ${error}`);
    return null;
  }
};

// Variante pratique : ne garde que le premier résultat (fiche catalogue d'un satellite donné,
// ex: lu depuis l'ID NORAD résolu d'un satellite déjà identifié).
export const getNoradSatellite = async (query: string | number): Promise<NoradSatellite | null> => {
  const results = await findNoradSatellites(query);
  return results?.[0] ?? null;
};

export interface PaginatedNoradSatellites {
  data: NoradSatellite[];
  page: number;
  limit: number;
  total: number;
}

// Variante paginée de findNoradSatellites (page/limit opt-in côté API, mêmes bornes que la liste
// principale : défaut 100, max 500) — à utiliser pour une recherche par nom affichée dans une liste
// (ex: AddSatelliteModal), sans télécharger les milliers de résultats qu'une requête large comme
// "starlink" peut renvoyer. `total` reste le nombre réel de correspondances, même si `data` n'en
// contient qu'une page : sert à afficher "X résultats, affine ta recherche" sans sur-télécharger.
export const searchNoradSatellites = async (
  query: string | number,
  { page, limit }: { page?: number; limit?: number } = {}
): Promise<PaginatedNoradSatellites | null> => {
  try {
    console.log(`[searchNoradSatellites] Fetching norad query ${query} (page=${page}, limit=${limit})`);

    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));
    const queryString = params.toString();

    const response = await fetch(`${BASE_URL}/${encodeURIComponent(query)}${queryString ? `?${queryString}` : ""}`);
    if (response.status === 404) return { data: [], page: page ?? 1, limit: limit ?? 100, total: 0 };
    if (!response.ok) {
      console.log(`[searchNoradSatellites] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json() as PaginatedNoradSatellites;
  } catch (error) {
    console.log(`[searchNoradSatellites] Error: ${error}`);
    return null;
  }
};

// GET /v3/norad/group/<id1>/<id2>/... : plusieurs IDs NORAD en un seul appel (ex: la liste "mes
// satellites" de l'utilisateur), plutôt qu'une requête par ID.
export const getNoradSatellitesByIds = async (noradIds: number[]): Promise<NoradSatellite[] | null> => {
  if (noradIds.length === 0) return [];

  try {
    console.log(`[getNoradSatellitesByIds] Fetching norad group ${noradIds.join(",")}`);

    const response = await fetch(`${BASE_URL}/group/${noradIds.join("/")}`);
    if (response.status === 404) return [];
    if (!response.ok) {
      console.log(`[getNoradSatellitesByIds] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as NoradSatellite[];
  } catch (error) {
    console.log(`[getNoradSatellitesByIds] Error: ${error}`);
    return null;
  }
};
