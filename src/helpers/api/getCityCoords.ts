import axios from "axios"
import { geocodingApi } from "."

export const getCityCoords = async (cityName: string) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/location/coords`, { params: { name: cityName } })
    
    return response.data.data
  } catch (error: any) {
    console.log("Get city coords error :", error.message)
    return error
  }
}