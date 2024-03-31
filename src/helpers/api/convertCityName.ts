import { geocodingApi } from "."
import { LocationObject } from "../types/LocationObject"

export const getLocationName = async (coords: LocationObject) => {
  try {
    const response = await geocodingApi.get(``, { params: { lat: coords.lat, lon: coords.lon, limit: 1 } })
    return response.data
  } catch (error) {
    console.log(error)
    return error
  }
}