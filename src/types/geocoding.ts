export type ApiEnvelope<T> = { data: T };

// --- Weather ---
type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type WeatherPoint = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherCondition[];
};

type CurrentWeather = WeatherPoint & { sunrise: number; sunset: number };
type MinutelyWeather = { dt: number; precipitation: number };
type HourlyWeather = WeatherPoint & { pop: number; rain?: { "1h": number } };
type DailyWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: { day: number; min: number; max: number; night: number; eve: number; morn: number };
  feels_like: { day: number; night: number; eve: number; morn: number };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  uvi: number;
};

export type WeatherData = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely: MinutelyWeather[];
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};

// --- Location name (reverse geocoding) ---
export type LocationName = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

// --- Light pollution ---
export type LightPollutionData = {
  lat: number;
  lon: number;
  location: string;
  mpsas: string; // string dans la réponse API, pas un number
  bortle: number;
  source: string;
};

export type GeocodingFlags = {
  withWeather?: boolean;
  withLocationName?: boolean;
  withLightPollution?: boolean;
};