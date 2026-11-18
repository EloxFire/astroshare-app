import { useCallback, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";
import { searchNoradSatellites } from "../helpers/api/satellites/norad";
import { NoradSatellite } from "../types/satellites/NoradSatellite";

const SEARCH_DEBOUNCE_MS = 400;
// /v3/norad/:query pagine désormais (opt-in) : on ne demande que ce qu'on affiche réellement dans
// la liste déroulante, plutôt que de télécharger les milliers de résultats qu'une requête large
// (ex: "starlink", 13 000+ correspondances) peut renvoyer sans ce paramètre.
const RESULTS_LIMIT = 30;

// Recherche par nom dans le catalogue NORAD (/v3/norad/:query, correspondance partielle, paginée)
// pour un champ de recherche — même principe que useObjectSearch (catalogue d'objets) : debounce,
// état loading/résultats, et protection contre les réponses obsolètes (deux frappes plus espacées
// que le debounce peuvent chacune avoir une requête en vol, la plus ancienne pouvant répondre après).
//
// Usage : const { results, total, loading, search } = useSatelliteNameSearch(); puis `search(text)`
// à chaque frappe (onChangeText), `results` (au plus RESULTS_LIMIT éléments) pour l'affichage, et
// `total` (nombre réel de correspondances côté serveur) pour signaler qu'il y en a davantage.
export const useSatelliteNameSearch = () => {
  const [results, setResults] = useState<NoradSatellite[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const latestRequestId = useRef(0);

  const runSearch = useCallback(async (query: string) => {
    const requestId = ++latestRequestId.current;
    const response = await searchNoradSatellites(query, { page: 1, limit: RESULTS_LIMIT });
    if (requestId !== latestRequestId.current) return;
    setResults(response?.data ?? []);
    setTotal(response?.total ?? 0);
    setLoading(false);
  }, []);

  const debouncedSearch = useDebounce(runSearch, SEARCH_DEBOUNCE_MS);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      latestRequestId.current++;
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    debouncedSearch(query);
  }, [debouncedSearch]);

  return { results, total, loading, search };
};
