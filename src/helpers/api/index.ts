import axios from 'axios';

export const geocodingApi = axios.create({
  baseURL: 'http://api.openweathermap.org/geo/1.0/reverse',
})

geocodingApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY
}