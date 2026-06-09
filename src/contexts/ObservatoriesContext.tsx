import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Observatory } from '../helpers/types/Observatory';
import { useAuth } from './AuthContext';
import { useSettings } from './AppSettingsContext';
import {
  addObservatory,
  deleteObservatory,
  getObservatories,
  getSelectedObservatoryId,
  setSelectedObservatoryId,
  updateObservatory,
} from '../helpers/scripts/observatories/observatories';
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords';

const ObservatoriesContext = createContext<any>({});

export const useObservatories = () => useContext(ObservatoriesContext);

export function ObservatoriesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { setCurrentUserLocation, refreshCurrentUserLocation } = useSettings();

  const [observatories, setObservatories] = useState<Observatory[]>([]);
  const [selectedObservatory, setSelectedObservatoryState] = useState<Observatory | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setObservatories([]);
      setSelectedObservatoryState(null);
      return;
    }
    (async () => {
      const list = await getObservatories(currentUser.uid);
      setObservatories(list);

      const selectedId = await getSelectedObservatoryId(currentUser.uid);
      if (selectedId) {
        const obs = list.find((o) => o.id === selectedId) ?? null;
        setSelectedObservatoryState(obs);
        if (obs) applyObservatoryLocation(obs);
      }
    })();
  }, [currentUser?.uid]);

  const applyObservatoryLocation = (obs: Observatory) => {
    setCurrentUserLocation({
      lat: obs.latitude,
      lon: obs.longitude,
      dms: convertDDtoDMS(obs.latitude, obs.longitude),
      common_name: obs.name,
    });
  };

  const refreshObservatories = async () => {
    if (!currentUser?.uid) return;
    const list = await getObservatories(currentUser.uid);
    setObservatories(list);

    // Keep selected observatory in sync with potentially updated data
    if (selectedObservatory) {
      const refreshed = list.find((o) => o.id === selectedObservatory.id) ?? null;
      setSelectedObservatoryState(refreshed);
      if (refreshed) applyObservatoryLocation(refreshed);
    }
  };

  const selectObservatory = async (obs: Observatory | null) => {
    if (!currentUser?.uid) return;
    setSelectedObservatoryState(obs);
    await setSelectedObservatoryId(currentUser.uid, obs?.id ?? null);

    if (obs) {
      applyObservatoryLocation(obs);
    } else {
      await refreshCurrentUserLocation();
    }
  };

  const saveObservatory = async (obs: Observatory) => {
    if (!currentUser?.uid) return;
    const existing = observatories.find((o) => o.id === obs.id);
    if (existing) {
      await updateObservatory(currentUser.uid, obs);
    } else {
      await addObservatory(currentUser.uid, obs);
    }
    await refreshObservatories();
  };

  const removeObservatory = async (id: string) => {
    if (!currentUser?.uid) return;
    if (selectedObservatory?.id === id) {
      await selectObservatory(null);
    }
    await deleteObservatory(currentUser.uid, id);
    await refreshObservatories();
  };

  const values = {
    observatories,
    selectedObservatory,
    selectObservatory,
    refreshObservatories,
    saveObservatory,
    removeObservatory,
  };

  return <ObservatoriesContext.Provider value={values}>{children}</ObservatoriesContext.Provider>;
}
