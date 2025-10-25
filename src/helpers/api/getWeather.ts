import axios from "axios"
import { i18n } from "../scripts/i18n"

export const getWeather = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/weather`, { params: { lat, lon: lng, lang: i18n.locale || 'fr' } })
    return response.data.data
  } catch (error) {
    console.log('[Weather] Error fetching weather data:', error)
    return error
  }
}