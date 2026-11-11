import { useCallback, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";
import { searchObjects } from "../helpers/api/catalog/objects";
import { CatalogObjectSummary } from "../types/catalog/CatalogObject";

const SEARCH_DEBOUNCE_MS = 250;

// Centralise la recherche catalogue (/v3/objects/search) pour un champ de recherche : debounce,
// état loading/résultats, et protection contre les réponses obsolètes. Le debounce seul ne suffit
// pas : deux frappes plus espacées que le délai de debounce peuvent chacune avoir une requête en
// vol en même temps, et la plus ancienne peut répondre après la plus récente.
//
// Usage : const { results, loading, search } = useObjectSearch(); puis `search(text)` à chaque
// frappe (onChangeText) et `results`/`loading` pour l'affichage.
export const useObjectSearch = () => {
  const [results, setResults] = useState<CatalogObjectSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const latestRequestId = useRef(0);

  const runSearch = useCallback(async (query: string) => {
    const requestId = ++latestRequestId.current;
    const data = await searchObjects(query);
    // Une recherche plus récente est déjà repartie (ou terminée) pendant cette requête : on
    // ignore cette réponse, désormais obsolète, plutôt que d'écraser des résultats plus frais.
    if (requestId !== latestRequestId.current) return;
    setResults(data ?? []);
    setLoading(false);
  }, []);

  const debouncedSearch = useDebounce(runSearch, SEARCH_DEBOUNCE_MS);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      latestRequestId.current++; // invalide toute requête encore en vol
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debouncedSearch(query);
  }, [debouncedSearch]);

  return { results, loading, search };
};
