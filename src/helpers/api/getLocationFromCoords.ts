import { reverseGeocodingApi } from "."
import { LocationObject } from "../types/LocationObject"

export const getLocationName = async (coords: LocationObject) => {
  try {
    const response = await reverseGeocodingApi.get(``, { params: { lat: coords.lat, lon: coords.lon, limit: 1 } })
    console.log("City found :", response.data[0].local_names.fr);
    return response.data
  } catch (error: any) {
    console.log("Error while retreiving the city : ", error.message)
    return error
  }
}