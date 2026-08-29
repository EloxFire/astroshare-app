import { useUserDataStore } from "../store/userData.store";
import { useCurrentGpsPosition } from "./useCurrentGpsPosition";
import { useGeocoding } from "./useGeocoding";
import type { GeocodingFlags } from "../types/geocoding";

export const useObservatory = (flags: GeocodingFlags = {}) => {
  const observatories = useUserDataStore((state) => state.observatories);
  const activeObservatoryId = useUserDataStore((state) => state.activeObservatoryId);
  const usesGps = activeObservatoryId === null;

  // Le GPS n'est interrogé (permission + fetch) que si aucun observatoire n'est actif
  const gps = useCurrentGpsPosition(usesGps, usesGps ? flags : {});

  const activeObservatory = !usesGps ? observatories.find((o) => o.id === activeObservatoryId) : undefined;
  const observatoryPosition = activeObservatory
    ? { latitude: activeObservatory.latitude, longitude: activeObservatory.longitude, elevation: activeObservatory.elevation ?? 0 }
    : null;

  const observatoryGeocoding = useGeocoding(
    observatoryPosition?.latitude ?? null,
    observatoryPosition?.longitude ?? null,
    !usesGps ? flags : {}
  );

  if (usesGps) {
    return {
      position: gps.position,
      weather: gps.weather,
      locationName: gps.locationName,
      lightPollution: gps.lightPollution,
      loading: gps.loading,
      error: gps.error,
    };
  }

  return {
    position: observatoryPosition,
    weather: observatoryGeocoding.weather,
    locationName: observatoryGeocoding.locationName,
    lightPollution: observatoryGeocoding.lightPollution,
    loading: observatoryGeocoding.isLoading,
    error: observatoryGeocoding.error,
  };
};
