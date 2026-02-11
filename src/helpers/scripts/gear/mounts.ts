import { storageKeys } from '../../constants';
import { getObject, storeObject } from '../../storage';
import { Mount } from '../../types/gear/Mount';
import { showToast } from '../showToast';

export const addMount = async (userId: string, mount: Mount): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot add mount: userId is null or undefined.`);
    return;
  }

  if(!mount.name){
    console.log(`[Gear Management] Cannot add mount: invalid mount data.`, mount);
    showToast({message: "La monture doit avoir un nom valide.", type: "error"});
    return;
  }

  if(!mount.type){
    console.log(`[Gear Management] Cannot add mount: invalid mount data.`, mount);
    showToast({message: "Le type de monture doit être spécifié.", type: "error"});
    return;
  }

  const existingMounts = await getObject(`${storageKeys.userGear.mounts}${userId}`) || [];

  console.log(`[Gear Management] Adding mount for user ${userId}:`, mount);
  await storeObject(`${storageKeys.userGear.mounts}${userId}`, [...existingMounts, mount]);
  console.log(`[Gear Management] Mount stored successfully for user ${userId}.`);
  showToast({message: "Monture ajoutée avec succès !", type: "success"});
}

export const getMounts = async (userId: string): Promise<Mount[]> => {
  try {
    console.log(`[Gear Management] Fetching mounts from local storage with key ${storageKeys.userGear.mounts}${userId}...`);
    const mountsData = await getObject(`${storageKeys.userGear.mounts}${userId}`);

    if (mountsData) {
      console.log(`[Gear Management] Mounts data found:`, mountsData);
      return mountsData as Mount[];
    }else{
      console.log(`[Gear Management] No mounts data found for currentUser`);
    }
  } catch (error) {
    console.log(`[Gear Management] Error fetching mounts:`, error);
    showToast({message: "Erreur lors de la récupération des montures.", type: "error"});
  }
  return [];
}

export const deleteMount = async (userId: string, mountId: string): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot delete mount: userId is null or undefined.`);
    return;
  }

  const existingMounts = await getObject(`${storageKeys.userGear.mounts}${userId}`) || [];
  const updatedMounts = existingMounts.filter((mount: Mount) => mount.id !== mountId);

  console.log(`[Gear Management] Deleting mount for user ${userId}:`, mountId);
  await storeObject(`${storageKeys.userGear.mounts}${userId}`, updatedMounts);
  console.log(`[Gear Management] Mount deleted successfully for user ${userId}.`);
  showToast({message: "Monture supprimée avec succès !", type: "success"});
}

export const updateMount = async (userId: string, updatedMount: Mount): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot update mount: userId is null or undefined.`);
    return;
  }

  const existingMounts = await getObject(`${storageKeys.userGear.mounts}${userId}`) || [];
  const updatedMounts = existingMounts.map((mount: Mount) => {
    if(mount.id === updatedMount.id){
      return updatedMount;
    }
    return mount;
  });

  console.log(`[Gear Management] Updating mount for user ${userId}:`, updatedMount);
  await storeObject(`${storageKeys.userGear.mounts}${userId}`, updatedMounts);
  console.log(`[Gear Management] Mount updated successfully for user ${userId}.`);
  showToast({message: "Monture mise à jour avec succès !", type: "success"});
}