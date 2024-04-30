import axios from "axios"

export const getWeather = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/weather`, { params: { lat, lon: lng } })
    return response.data.data
  } catch (error) {
    console.log(error)
    return error
  }
}