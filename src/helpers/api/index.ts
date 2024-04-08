import axios from 'axios';

export const reverseGeocodingApi = axios.create({
  baseURL: 'http://api.openweathermap.org/geo/1.0/reverse',
})

export const geocodingApi = axios.create({
  baseURL: 'http://api.openweathermap.org/geo/1.0/direct',
})

export const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/3.0/onecall',
});

export const moonApi = axios.create({
  baseURL: 'https://moon-phase.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': process.env.EXPO_PUBLIC_MOON_API_KEY,
    'x-rapidapi-host': 'moon-phase.p.rapidapi.com',
  }
})

reverseGeocodingApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY
}

geocodingApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY,
}

weatherApi.defaults.params = {
  appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY,
  units: 'metric',
  lang: 'fr',
}