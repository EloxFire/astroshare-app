import { Apod } from "../../../types/apod/Apod";

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