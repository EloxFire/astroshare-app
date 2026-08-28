import { useMemo } from "react";
import { useUserDataStore } from "../store/userData.store";
import { useCurrentGpsPosition } from "./useCurrentGpsPosition";
import type { Observer } from "../helpers/astrometry/moon";

export const useActiveObserver = (date: Date) => {
  const observatories = useUserDataStore((state) => state.observatories);
  const activeObservatoryId = useUserDataStore((state) => state.activeObservatoryId);
  const { position: gpsPosition, loading, error } = useCurrentGpsPosition(activeObservatoryId === null);

  const observer: Observer | undefined = useMemo(() => {
    if (activeObservatoryId === null) {
      return gpsPosition ? { ...gpsPosition, datetime: date } : undefined;
    }
    const active = observatories.find((o) => o.id === activeObservatoryId);
    return active ? { latitude: active.latitude, longitude: active.longitude, elevation: active.elevation || 0, datetime: date } : undefined;
  }, [activeObservatoryId, observatories, gpsPosition, date]);

  return { observer, loading, error };
};
