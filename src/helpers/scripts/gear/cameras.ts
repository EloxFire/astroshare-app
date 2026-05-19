import { storageKeys } from '../../constants';
import { getObject, storeObject } from '../../storage';
import { Camera } from '../../types/gear/Camera';
import { showToast } from '../showToast';

export const addCamera = async (userId: string, camera: Camera): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot add camera: userId is null or undefined.`);
    return;
  }

  if(!camera.name){
    console.log(`[Gear Management] Cannot add camera: invalid camera data.`, camera);
    showToast({message: "La caméra doit avoir un nom valide.", type: "error"});
    return;
  }

  if(camera.sensorSize.width <= 0 || camera.sensorSize.height <= 0){
    console.log(`[Gear Management] Cannot add camera: invalid camera data.`, camera);
    showToast({message: "La taille du capteur doit être composée de nombres positifs.", type: "error"});
    return;
  }

  if(camera.resolution.width <= 0 || camera.resolution.height <= 0){
    console.log(`[Gear Management] Cannot add camera: invalid camera data.`, camera);
    showToast({message: "La résolution doit être composée de nombres positifs.", type: "error"});
    return;
  }

  if(camera.pixelSize <= 0){
    console.log(`[Gear Management] Cannot add camera: invalid camera data.`, camera);
    showToast({message: "La taille du pixel doit être un nombre positif.", type: "error"});
    return;
  }

  const existingCameras = await getObject(`${storageKeys.userGear.cameras}${userId}`) || [];

  console.log(`[Gear Management] Adding camera for user ${userId}:`, camera);
  await storeObject(`${storageKeys.userGear.cameras}${userId}`, [...existingCameras, camera]);
  console.log(`[Gear Management] Camera stored successfully for user ${userId}.`);
  showToast({message: "Caméra ajoutée avec succès !", type: "success"});
}

export const getCameras = async (userId: string): Promise<Camera[]> => {
  try {
    console.log(`[Gear Management] Fetching cameras from local storage with key ${storageKeys.userGear.cameras}${userId}...`);
    const camerasData = await getObject(`${storageKeys.userGear.cameras}${userId}`);

    if (camerasData) {
      console.log(`[Gear Management] Cameras data found:`, camerasData);
      return camerasData as Camera[];
    }else{
      console.log(`[Gear Management] No cameras data found for currentUser`);
    }
  } catch (error) {
    console.log(`[Gear Management] Error fetching cameras:`, error);
    showToast({message: "Erreur lors de la récupération des caméras.", type: "error"});
  }
  return [];
}

export const deleteCamera = async (userId: string, cameraId: string): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot delete camera: userId is null or undefined.`);
    return;
  }

  const existingCameras = await getObject(`${storageKeys.userGear.cameras}${userId}`) || [];
  const updatedCameras = existingCameras.filter((camera: Camera) => camera.id !== cameraId);

  console.log(`[Gear Management] Deleting camera for user ${userId}:`, cameraId);
  await storeObject(`${storageKeys.userGear.cameras}${userId}`, updatedCameras);
  console.log(`[Gear Management] Camera deleted successfully for user ${userId}.`);
  showToast({message: "Caméra supprimée avec succès !", type: "success"});
}

export const updateCamera = async (userId: string, updatedCamera: Camera): Promise<void> => {
  if(!userId){
    console.log(`[Gear Management] Cannot update camera: userId is null or undefined.`);
    return;
  }

  const existingCameras = await getObject(`${storageKeys.userGear.cameras}${userId}`) || [];
  const updatedCameras = existingCameras.map((camera: Camera) => {
    if(camera.id === updatedCamera.id){
      return updatedCamera;
    }
    return camera;
  });

  console.log(`[Gear Management] Updating camera for user ${userId}:`, updatedCamera);
  await storeObject(`${storageKeys.userGear.cameras}${userId}`, updatedCameras);
  console.log(`[Gear Management] Camera updated successfully for user ${userId}.`);
  showToast({message: "Caméra mise à jour avec succès !", type: "success"});
}