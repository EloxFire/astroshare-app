// Mise en correspondance prévision météo ↔ évènement d'éclipse — port de
// astroshare-public-tools/src/helpers/matchWeatherToEclipse.ts. `WeatherData` (voir
// types/weather/Weather.ts) vient de /v3/weather (relai OpenWeather One Call 3.0) : seulement ~48h de
// détail horaire et ~8 jours de journalier, bien plus court que l'horizon des éclipses consultables
// (plusieurs années) — sans cette vérification on afficherait soit une erreur confuse, soit la
// prévision d'une mauvaise date présentée comme celle de l'éclipse.
import dayjs from "dayjs";
import type { DailyWeather, HourlyWeather, WeatherData } from "../../types/weather/Weather";

const HOURLY_HORIZON_H = 48;
const DAILY_HORIZON_DAYS = 8;

export type EclipseWeatherMatch =
  // `hourly` : le tableau complet, pour permettre à l'appelant de construire une bande heure par
  // heure autour de `entry` (voir getHourlyWindow), au-delà de la simple carte "au moment de l'éclipse".
  | { status: "hourly"; entry: HourlyWeather; hourly: HourlyWeather[] }
  | { status: "daily"; entry: DailyWeather }
  | { status: "unavailable"; reason: "past" }
  | { status: "unavailable"; reason: "too-far"; daysUntilAvailable: number };

const closestBy = <T extends { dt: number }>(entries: T[], targetUnix: number): T =>
  entries.reduce((closest, candidate) => (Math.abs(candidate.dt - targetUnix) < Math.abs(closest.dt - targetUnix) ? candidate : closest));

// `eventDateIsoNoZ` : date d'un évènement de l'éclipse telle que renvoyée par l'API Astroshare (UTC
// sans suffixe 'Z') — on ajoute 'Z' pour obtenir le même instant UTC réel que les timestamps `dt`
// d'OpenWeather (eux aussi UTC).
export const matchWeatherToEclipse = (weather: WeatherData, eventDateIsoNoZ: string): EclipseWeatherMatch => {
  const targetUnix = dayjs(`${eventDateIsoNoZ}Z`).unix();
  const hoursUntil = (targetUnix - dayjs().unix()) / 3600;

  if (hoursUntil < -1) return { status: "unavailable", reason: "past" };

  if (hoursUntil <= HOURLY_HORIZON_H && weather.hourly.length > 0) {
    return { status: "hourly", entry: closestBy(weather.hourly, targetUnix), hourly: weather.hourly };
  }

  if (hoursUntil <= DAILY_HORIZON_DAYS * 24 && weather.daily.length > 0) {
    return { status: "daily", entry: closestBy(weather.daily, targetUnix) };
  }

  return { status: "unavailable", reason: "too-far", daysUntilAvailable: Math.ceil(hoursUntil / 24 - DAILY_HORIZON_DAYS) };
};

// Fenêtre de quelques heures avant/après l'heure retenue plutôt que la totalité des 48h disponibles
// (trop dense pour une bande à faire défiler) — assez pour couvrir la durée typique d'une éclipse et
// un peu de marge de part et d'autre.
const HOURLY_WINDOW_RADIUS = 5;

export const getHourlyWindow = (hourly: HourlyWeather[], entry: HourlyWeather): HourlyWeather[] => {
  const index = hourly.findIndex((h) => h.dt === entry.dt);
  if (index === -1) return [entry];
  return hourly.slice(Math.max(0, index - HOURLY_WINDOW_RADIUS), index + HOURLY_WINDOW_RADIUS + 1);
};
