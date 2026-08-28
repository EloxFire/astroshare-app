import { useQuery } from "@tanstack/react-query";
import { fetchLocationCoords } from "../helpers/api/geocoding";

export const useLocationSearch = (name: string) => {
  const query = useQuery({
    queryKey: ["locationCoords", name],
    queryFn: () => fetchLocationCoords(name),
    enabled: name.trim().length > 0,
    staleTime: Infinity, // une recherche par nom retourne toujours les mêmes résultats
  });

  return {
    results: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};