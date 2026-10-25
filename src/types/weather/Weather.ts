// Forme du payload OpenWeather One Call 3.0, tel que relayé par /v3/weather côté API — voir
// https://openweathermap.org/api/one-call-3 pour la référence complète des champs.

export type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type CurrentWeather = {
  dt: number;
  sunrise?: number;
  sunset?: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_gust?: number;
  wind_deg: number;
  rain?: { "1h": number };
  snow?: { "1h": number };
  weather: WeatherCondition[];
}

export type MinutelyWeather = {
  dt: number;
  precipitation: number; // mm/h
}

export type HourlyWeather = CurrentWeather & {
  pop: number; // probabilité de précipitation, 0-1
}

export type DailyTemperature = {
  morn: number;
  day: number;
  eve: number;
  night: number;
  min: number;
  max: number;
}

export type DailyFeelsLike = {
  morn: number;
  day: number;
  eve: number;
  night: number;
}

export type DailyWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number; // 0-1 (0/1 = nouvelle lune, 0.5 = pleine lune)
  summary?: string;
  temp: DailyTemperature;
  feels_like: DailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_gust?: number;
  wind_deg: number;
  clouds: number;
  pop: number;
  rain?: number; // mm
  snow?: number; // mm
  uvi: number;
  weather: WeatherCondition[];
}

export type WeatherAlert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export type WeatherData = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely?: MinutelyWeather[]; // 61 points, pluie/min sur 1h
  hourly: HourlyWeather[]; // 48h
  daily: DailyWeather[]; // 8 jours
  alerts?: WeatherAlert[];
}
