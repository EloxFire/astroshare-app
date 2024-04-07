import axios from 'axios';

export const geocodingApi = axios.create({
  baseURL: 'http://api.openweathermap.org/geo/1.0/reverse',
})

export const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/3.0/onecall',
});

geocodingApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY
}

weatherApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY,
  units: 'metric',
  lang: 'fr',
}