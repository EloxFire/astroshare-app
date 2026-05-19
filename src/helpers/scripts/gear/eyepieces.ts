import { storageKeys } from '../../constants';
import { getObject, storeObject } from '../../storage';
import { Eyepiece } from '../../types/gear/Eyepiece';
import { showToast } from '../showToast';

export const addEyepiece = async (userId: string, eyepiece: Eyepiece): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot add eyepiece: userId is null or undefined.`);
    return;
  }

  if(!eyepiece.name){
    console.log(`[Gear Management] Cannot add eyepiece: invalid eyepiece data.`, eyepiece);
    showToast({message: "L'oculaire doit avoir un nom valide.", type: "error"});
    return;
  }

  if(eyepiece.apparentFieldOfView <= 0 || eyepiece.focalLength <= 0){
    console.log(`[Gear Management] Cannot add eyepiece: invalid eyepiece data.`, eyepiece);
    showToast({message: "Le champ apparent et la focale doivent être des nombres positifs.", type: "error"});
    return;
  }

  const existingEyepieces = await getObject(`${storageKeys.userGear.eyepieces}${userId}`) || [];

  console.log(`[Gear Management] Adding eyepiece for user ${userId}:`, eyepiece);
  await storeObject(`${storageKeys.userGear.eyepieces}${userId}`, [...existingEyepieces, eyepiece]);
  console.log(`[Gear Management] Eyepiece stored successfully for user ${userId}.`);
  showToast({message: "Oculaire ajouté avec succès !", type: "success"});
}

export const getEyepieces = async (userId: string): Promise<Eyepiece[]> => {
  try {
    console.log(`[Gear Management] Fetching eyepieces from local storage with key ${storageKeys.userGear.eyepieces}${userId}...`);
    const eyepiecesData = await getObject(`${storageKeys.userGear.eyepieces}${userId}`);

    if (eyepiecesData) {
      console.log(`[Gear Management] Eyepieces data found:`, eyepiecesData);
      return eyepiecesData as Eyepiece[];
    }else{
      console.log(`[Gear Management] No eyepieces data found for currentUser`);
    }
  } catch (error) {
    console.log(`[Gear Management] Error fetching eyepieces:`, error);
    showToast({message: "Erreur lors de la récupération des oculaires.", type: "error"});
  }
  return [];
}

export const deleteEyepiece = async (userId: string, eyepieceId: string): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot delete eyepiece: userId is null or undefined.`);
    return;
  }

  const existingEyepieces = await getObject(`${storageKeys.userGear.eyepieces}${userId}`) || [];
  const updatedEyepieces = existingEyepieces.filter((eyepiece: Eyepiece) => eyepiece.id !== eyepieceId);

  console.log(`[Gear Management] Deleting eyepiece for user ${userId}:`, eyepieceId);
  await storeObject(`${storageKeys.userGear.eyepieces}${userId}`, updatedEyepieces);
  console.log(`[Gear Management] Eyepiece deleted successfully for user ${userId}.`);
  showToast({message: "Oculaire supprimé avec succès !", type: "success"});
}

export const updateEyepiece = async (userId: string, updatedEyepiece: Eyepiece): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot update eyepiece: userId is null or undefined.`);
    return;
  }

  const existingEyepieces = await getObject(`${storageKeys.userGear.eyepieces}${userId}`) || [];
  const updatedEyepieces = existingEyepieces.map((eyepiece: Eyepiece) => {
    if(eyepiece.id === updatedEyepiece.id){
      return updatedEyepiece;
    }
    return eyepiece;
  });

  console.log(`[Gear Management] Updating eyepiece for user ${userId}:`, updatedEyepiece);
  await storeObject(`${storageKeys.userGear.eyepieces}${userId}`, updatedEyepieces);
  console.log(`[Gear Management] Eyepiece updated successfully for user ${userId}.`);
  showToast({message: "Oculaire mis à jour avec succès !", type: "success"});
}