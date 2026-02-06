import { storageKeys } from '../../constants';
import { getObject } from '../../storage';
import { Telescope } from './../../types/gear/Telescope';

export const addTelescope = async (userId: string, telescope: Telescope): Promise<void> => {
  
}

export const getTelescopes = async (userId: string): Promise<Telescope[]> => {
  try {
    console.log(`[Gear Management] Fetching telescopes from local storage...`);
    const telescopesData = await getObject(`${storageKeys.userGear.telescopes}${userId}`);

    if (telescopesData) {
      console.log(`[Gear Management] Telescopes data found:`, telescopesData);
    }else{
      console.log(`[Gear Management] No telescopes data found for currentUser`);
    }
  } catch (error) {
    console.error(`[Gear Management] Error fetching telescopes:`, error);
    
  }
  return [];
}