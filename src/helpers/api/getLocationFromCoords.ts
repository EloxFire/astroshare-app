import axios from "axios";
import { LocationObject } from "../types/LocationObject"

export const getLocationName = async (coords: LocationObject) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/location/name`, {params: {lat: coords.lat, lon: coords.lon}})
    if (!response.data.data) {
      return { local_names: { fr: "Inconnu" }, country: "Inconnu", state: "Inconnu" }
    }
    return response.data.data
  } catch (error: any) {
    console.log("Error while retreiving the city : ", error)
    return error
  }
}