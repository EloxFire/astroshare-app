import { storageKeys } from '../../constants';
import { getObject, storeObject } from '../../storage';
import { showToast } from '../showToast';
import { Telescope } from './../../types/gear/Telescope';

export const addTelescope = async (userId: string, telescope: Telescope): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot add telescope: userId is null or undefined.`);
    return;
  }

  if(!telescope.name){
    console.log(`[Gear Management] Cannot add telescope: invalid telescope data.`, telescope);
    showToast({message: "Le télescope doit avoir un nom valide.", type: "error"});
    return;
  }

  if(telescope.diameter <= 0 || telescope.focalLength <= 0){
    console.log(`[Gear Management] Cannot add telescope: invalid telescope data.`, telescope);
    showToast({message: "Le diamètre et la focale doivent être des nombres positifs.", type: "error"});
    return;
  }

  const existingTelescopes = await getObject(`${storageKeys.userGear.telescopes}${userId}`) || [];

  console.log(`[Gear Management] Adding telescope for user ${userId}:`, telescope);
  await storeObject(`${storageKeys.userGear.telescopes}${userId}`, [...existingTelescopes, telescope]);
  console.log(`[Gear Management] Telescope stored successfully for user ${userId}.`);
  showToast({message: "Télescope ajouté avec succès !", type: "success"});
}

export const getTelescopes = async (userId: string): Promise<Telescope[]> => {
  try {
    console.log(`[Gear Management] Fetching telescopes from local storage with key ${storageKeys.userGear.telescopes}${userId}...`);
    const telescopesData = await getObject(`${storageKeys.userGear.telescopes}${userId}`);

    if (telescopesData) {
      console.log(`[Gear Management] Telescopes data found:`, telescopesData);
      return telescopesData as Telescope[];
    }else{
      console.log(`[Gear Management] No telescopes data found for currentUser`);
    }
  } catch (error) {
    console.log(`[Gear Management] Error fetching telescopes:`, error);
    showToast({message: "Erreur lors de la récupération des télescopes.", type: "error"});
  }
  return [];
}

export const deleteTelescope = async (userId: string, telescopeId: string): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot delete telescope: userId is null or undefined.`);
    return;
  }

  const existingTelescopes = await getObject(`${storageKeys.userGear.telescopes}${userId}`) || [];
  const updatedTelescopes = existingTelescopes.filter((telescope: Telescope) => telescope.id !== telescopeId);

  console.log(`[Gear Management] Deleting telescope for user ${userId}:`, telescopeId);
  await storeObject(`${storageKeys.userGear.telescopes}${userId}`, updatedTelescopes);
  console.log(`[Gear Management] Telescope deleted successfully for user ${userId}.`);
  showToast({message: "Télescope supprimé avec succès !", type: "success"});
}

export const updateTelescope = async (userId: string, updatedTelescope: Telescope): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot update telescope: userId is null or undefined.`);
    return;
  }

  const existingTelescopes = await getObject(`${storageKeys.userGear.telescopes}${userId}`) || [];
  const updatedTelescopes = existingTelescopes.map((telescope: Telescope) => {
    if(telescope.id === updatedTelescope.id){
      return updatedTelescope;
    }
    return telescope;
  });

  console.log(`[Gear Management] Updating telescope for user ${userId}:`, updatedTelescope);
  await storeObject(`${storageKeys.userGear.telescopes}${userId}`, updatedTelescopes);
  console.log(`[Gear Management] Telescope updated successfully for user ${userId}.`);
  showToast({message: "Télescope mis à jour avec succès !", type: "success"});
}