import type { KpLevel } from "./KpIndex";

// Même format que /kpi pour level/scale (voir KpIndex.ts) — label a disparu ici aussi (redondant
// avec level, qui est déjà un identifiant à traduire via tools/spaceWeather:kpIndex.scale.<level>).
export type SolarWeatherOutlookDay = {
  date: string; // "AAAA-MM-JJ"
  radioFlux: number; // flux radio solaire à 10,7 cm — indicateur d'activité solaire générale
  aIndex: number; // indice A planétaire — activité géomagnétique moyenne de la journée
  kp: number; // Kp maximum attendu ce jour-là (0-9)
  level: KpLevel;
  scale: string | null; // "G1".."G5", ou null si pas de tempête géomagnétique attendue
}

export type SolarWeatherOutlookData = {
  data: SolarWeatherOutlookDay[]; // 27 jours
}
