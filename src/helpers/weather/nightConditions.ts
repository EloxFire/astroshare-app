import type { WeatherData, HourlyWeather } from "../../types/weather/Weather";
import type { AstroConditionsData } from "../../types/weather/AstroConditions";
import type { GpsLocation } from "../../types/gpsLocation";
import { computeObservabilityScore, type ObservabilityScore } from "./observabilityScore";
import { getAstronomicalNightWindow } from "../astrometry/night/nightWindow";

// Date à laquelle les données "nuit" se rapportent (début de la nuit astronomique à venir, ou
// maintenant si elle est déjà en cours) — utile pour l'affichage (ex: sous-titre "ce soir à HH:mm").
export interface ObservabilityNightReference {
  date: Date;
  isCurrentlyNight: boolean;
}

export interface NightDerivedData {
  nightConditions: WeatherData | null;
  nightReference: ObservabilityNightReference | null;
  observationScore: ObservabilityScore | null;
}

// Point le plus proche de `date` dans la série horaire OpenWeather (dt en secondes Unix), même
// principe que findClosestAstroPoint côté 7Timer — utilisé pour repositionner les conditions
// météo sur la nuit pertinente plutôt que sur l'instant présent.
const findClosestHourlyWeather = (hourly: HourlyWeather[], date: Date): HourlyWeather | undefined => {
  if (hourly.length === 0) return undefined;
  const targetSeconds = Math.floor(date.getTime() / 1000);
  return hourly.reduce((closest, point) =>
    Math.abs(point.dt - targetSeconds) < Math.abs(closest.dt - targetSeconds) ? point : closest
  );
};

// À partir des données météo/astro "instant présent", calcule les données pour la nuit pertinente :
// la nuit en cours s'il fait déjà nuit, sinon la prochaine nuit astronomique à venir. C'est ce qui
// alimente la carte de score d'observabilité (ObservabilityScoreCard).
export const computeNightDerivedData = (
  weather: WeatherData | null,
  astro: AstroConditionsData | null,
  location: GpsLocation | null
): NightDerivedData => {
  if (!weather || !location) {
    return { nightConditions: null, nightReference: null, observationScore: null };
  }

  const now = new Date();
  const observer = {
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: location.elevation ?? 0,
  };

  const window = getAstronomicalNightWindow(now, observer);
  // Pas de nuit astronomique aujourd'hui (été/haute latitude) : on retombe sur "maintenant".
  const nightDate = window ? (window.isCurrentlyNight ? now : window.start) : now;
  const isCurrentlyNight = window?.isCurrentlyNight ?? false;

  const nightCurrent = isCurrentlyNight ? weather.current : (findClosestHourlyWeather(weather.hourly, nightDate) ?? weather.current);
  const nightConditions: WeatherData = { ...weather, current: nightCurrent };
  const observationScore = computeObservabilityScore(nightConditions, astro, nightDate);

  return {
    nightConditions,
    nightReference: { date: nightDate, isCurrentlyNight },
    observationScore,
  };
};
