import type { ApiEnvelope, WeatherData, LocationName, LightPollutionData } from "../../types/geocoding";

const BASE_URL = process.env.EXPO_PUBLIC_ASTROSHARE_API_URL;

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Astroshare API error (${response.status}) on ${url}`);
  }
  return response.json();
};

export const fetchWeather = async (lat: number, lon: number, lang: string): Promise<WeatherData> => {
  const json = await fetchJson<ApiEnvelope<WeatherData>>(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&lang=${lang}`);
  return json.data;
};

export const fetchLocationName = async (lat: number, lon: number): Promise<LocationName> => {
  const json = await fetchJson<ApiEnvelope<LocationName>>(`${BASE_URL}/location/name?lat=${lat}&lon=${lon}`);
  return json.data;
};

export const fetchLightPollution = (lat: number, lon: number) =>
  fetchJson<LightPollutionData>(`${BASE_URL}/lightpollution?lat=${lat}&lon=${lon}`);

// Recherche par nom (géocodage direct) — même forme que LocationName, en tableau
export const fetchLocationCoords = async (name: string): Promise<LocationName[]> => {
  const json = await fetchJson<ApiEnvelope<LocationName[]>>(`${BASE_URL}/location/coords?name=${encodeURIComponent(name)}`);
  return json.data;
};