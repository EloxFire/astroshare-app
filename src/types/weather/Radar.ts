// Forme de la réponse /v3/weather/radar — pas de query params, pas liée à une position précise
// côté API (le cadrage de la carte se fait côté client, voir WeatherRadarMap).

export type RadarFrame = {
  time_tag: string; // ISO
  tileUrlTemplate: string; // {z}/{x}/{y}, convention XYZ standard (pas de flipY)
}

export type RadarPrecipitation = {
  source: string; // "RainViewer"
  frames: RadarFrame[]; // ~13 frames des ~2h passées, pas de 10 min, triées du plus ancien au plus récent
}

export type RadarClouds = {
  source: string; // "OpenWeatherMap"
  tileUrlTemplate: string; // vue instantanée, pas d'historique — contient la clé OWM en clair (voulu, route protégée côté API)
}

export type RadarData = {
  generated: string; // ISO
  precipitation: RadarPrecipitation;
  clouds: RadarClouds;
}
