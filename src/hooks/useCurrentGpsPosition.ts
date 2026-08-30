import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import { GpsPosition } from "../types/gpsLocation";
import { useGeocoding } from "./useGeocoding";
import type { GeocodingFlags } from "../types/geocoding";

// Sentinelle interne (pas un texte affiché) : queryFn ne peut pas appeler useTranslation()
// (ce n'est pas un hook), donc l'erreur est traduite après coup, côté hook, à partir de ce code.
const PERMISSION_DENIED = "PERMISSION_DENIED";

// Clé stable exportée : une seule entrée de cache pour "la position actuelle de l'appareil",
// partagée par tous les écrans qui la demandent (au lieu d'un fetch GPS par écran comme avant).
// Réutilisée par app/_layout.tsx pour la précharger dès le démarrage de l'app.
export const GPS_POSITION_QUERY_KEY = ["gpsPosition"];

export const fetchGpsPosition = async (): Promise<GpsPosition> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error(PERMISSION_DENIED);

  const coords = (await Location.getCurrentPositionAsync()).coords;

  // coords.altitude peut être `null` (simulateur, capteur indisponible) — 0 par défaut
  return { latitude: coords.latitude, longitude: coords.longitude, elevation: coords.altitude ?? 0 };
};

export const useCurrentGpsPosition = (enabled: boolean = true, flags: GeocodingFlags = {}) => {
  const { t } = useTranslation();

  // useQuery (pas useState/useEffect comme avant) : la position est mise en cache une seule
  // fois pour toute l'app (queryKey fixe), donc naviguer entre plusieurs écrans qui en ont
  // besoin ne redemande le GPS qu'une fois — les suivants lisent le cache instantanément
  // (staleTime hérité de la config globale, voir helpers/queryClient.ts : 5 minutes).
  const { data: position, isLoading: gpsLoading, error: gpsErrorRaw } = useQuery({
    queryKey: GPS_POSITION_QUERY_KEY,
    queryFn: fetchGpsPosition,
    enabled,
  });

  const gpsError = gpsErrorRaw
    ? gpsErrorRaw.message === PERMISSION_DENIED
      ? t("errors.locationPermissionDenied")
      : t("errors.locationError")
    : null;

  const { weather, locationName, lightPollution, isLoading: geocodingLoading, error: geocodingError } = useGeocoding(
    position?.latitude ?? null,
    position?.longitude ?? null,
    flags
  );

  return {
    position: position ?? null,
    weather,
    locationName,
    lightPollution,
    loading: gpsLoading || geocodingLoading,
    error: gpsError ?? geocodingError,
  };
};
