import { storageKeys } from '../../constants';
import { getData, getObject, removeData, storeData, storeObject } from '../../storage';
import { showToast } from '../showToast';
import { Observatory } from '../../types/Observatory';

const listKey = (userId: string) => `${storageKeys.observatories.list}${userId}`;
const selectedKey = (userId: string) => `${storageKeys.observatories.selected}${userId}`;

export const getObservatories = async (userId: string): Promise<Observatory[]> => {
  try {
    const data = await getObject(listKey(userId));
    return (data as Observatory[]) ?? [];
  } catch (error) {
    console.log(`[Observatories] Error fetching observatories:`, error);
    return [];
  }
};

export const addObservatory = async (userId: string, observatory: Observatory): Promise<void> => {
  if (!userId) return;
  if (!observatory.name) {
    showToast({ message: "L'observatoire doit avoir un nom.", type: 'error' });
    return;
  }
  const existing = await getObservatories(userId);
  await storeObject(listKey(userId), [...existing, observatory]);
  showToast({ message: 'Observatoire ajouté !', type: 'success' });
};

export const updateObservatory = async (userId: string, updated: Observatory): Promise<void> => {
  if (!userId) return;
  const existing = await getObservatories(userId);
  await storeObject(
    listKey(userId),
    existing.map((o) => (o.id === updated.id ? updated : o)),
  );
  showToast({ message: 'Observatoire mis à jour !', type: 'success' });
};

export const deleteObservatory = async (userId: string, id: string): Promise<void> => {
  if (!userId) return;
  const existing = await getObservatories(userId);
  await storeObject(
    listKey(userId),
    existing.filter((o) => o.id !== id),
  );
  showToast({ message: 'Observatoire supprimé.', type: 'success' });
};

export const getSelectedObservatoryId = async (userId: string): Promise<string | null> => {
  const value = await getData(selectedKey(userId));
  return value ?? null;
};

export const setSelectedObservatoryId = async (userId: string, id: string | null): Promise<void> => {
  if (id === null) {
    await removeData(selectedKey(userId));
  } else {
    await storeData(selectedKey(userId), id);
  }
};
