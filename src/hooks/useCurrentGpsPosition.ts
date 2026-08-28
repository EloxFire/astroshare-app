import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { GpsPosition } from "../types/gpsLocation";
import { useGeocoding } from "./useGeocoding";
import type { GeocodingFlags } from "../types/geocoding";

export const useCurrentGpsPosition = (enabled: boolean = true, flags: GeocodingFlags = {}) => {
  const [position, setPosition] = useState<GpsPosition | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      setGpsLoading(true);
      setGpsError(null);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!cancelled) setGpsError("Permission de localisation refusée");
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync();
        if (!cancelled) {
          // coords.altitude peut être `null` (simulateur, capteur indisponible) — 0 par défaut
          setPosition({ latitude: coords.latitude, longitude: coords.longitude, elevation: coords.altitude ?? 0 });
        }
      } catch (e) {
        if (!cancelled) setGpsError(e instanceof Error ? e.message : "Erreur de localisation");
      } finally {
        if (!cancelled) setGpsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const { weather, locationName, lightPollution, isLoading: geocodingLoading, error: geocodingError } = useGeocoding(
    position?.latitude ?? null,
    position?.longitude ?? null,
    flags
  );

  return {
    position,
    weather,
    locationName,
    lightPollution,
    loading: gpsLoading || geocodingLoading,
    error: gpsError ?? geocodingError,
  };
};
