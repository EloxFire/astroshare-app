import axios from "axios";
import { LocationObject } from "../types/LocationObject"

export const getLocationName = async (coords: LocationObject) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/location/name`, {params: {lat: coords.lat, lon: coords.lon}})
    console.log("City found :", response.data.data.local_names.fr);
    return response.data.data
  } catch (error: any) {
    console.log("Error while retreiving the city : ", error)
    return error
  }
}