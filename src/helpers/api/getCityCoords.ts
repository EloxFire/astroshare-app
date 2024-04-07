import { geocodingApi } from "."

export const getCityCoords = async (cityName: string) => {
  try {
    const response = await geocodingApi.get(``, { params: { q: cityName } })
    return response.data
  } catch (error: any) {
    console.log("Get city coords error :", error.message)
    return error
  }
}