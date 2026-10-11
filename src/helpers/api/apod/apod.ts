import { Apod } from "../../../types/apod/Apod";
import { FutureApod } from "../../../types/apod/FutureApod";

export const getCurrentApod = async (): Promise<Apod | null> => {
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/apod`);
    if (!response.ok) {
      console.log(`[getCurrentApod] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data.data as Apod;
  }catch(error){
    console.log(`[getCurrentApod] Error: ${error}`);
    return null;
  }
}

export const getFutureApod = async (): Promise<FutureApod | null> => {
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/apod/upcoming`);
    if (!response.ok) {
      console.log(`[getFutureApod] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data.data[0] as FutureApod;
  }catch(error){
    console.log(`[getFutureApod] Error: ${error}`);
    return null;
  }
}