import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchWeather, fetchLocationName, fetchLightPollution } from "../helpers/api/geocoding";
import type { GeocodingFlags } from "../types/geocoding";

export const useGeocoding = (lat: number | null, lon: number | null, flags: GeocodingFlags = {}, lang?: string) => {
  // useTranslation() (pas i18next.language directement) pour re-render et refetch
  // automatiquement si l'utilisateur change de langue en cours de session.
  const { i18n } = useTranslation();
  const resolvedLang = lang ?? i18n.language;
  const hasCoords = lat !== null && lon !== null;

  const weatherQuery = useQuery({
    queryKey: ["weather", lat, lon, resolvedLang],
    queryFn: () => fetchWeather(lat as number, lon as number, resolvedLang),
    enabled: hasCoords && !!flags.withWeather,
  });

  const locationNameQuery = useQuery({
    queryKey: ["locationName", lat, lon],
    queryFn: () => fetchLocationName(lat as number, lon as number),
    enabled: hasCoords && !!flags.withLocationName,
    staleTime: Infinity, // un couple lat/lon pointe toujours vers le même lieu
  });

  const lightPollutionQuery = useQuery({
    queryKey: ["lightPollution", lat, lon],
    queryFn: () => fetchLightPollution(lat as number, lon as number),
    enabled: hasCoords && !!flags.withLightPollution,
    staleTime: Infinity,
  });

  const queries = [weatherQuery, locationNameQuery, lightPollutionQuery];

  return {
    weather: weatherQuery.data,
    locationName: locationNameQuery.data,
    lightPollution: lightPollutionQuery.data,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    error: queries.find((q) => q.error)?.error ?? null,
  };
};
