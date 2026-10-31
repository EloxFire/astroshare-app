// Forme de la réponse /v3/weather/radar — pas de query params, pas liée à une position précise
// côté API (le cadrage de la carte se fait côté client, voir WeatherRadarMap). Les tuiles sont
// chargées directement depuis le CDN des fournisseurs (URL templates, pas d'image proxifiée).

export type RadarFrame = {
  time_tag: string; // ISO 8601 (UTC)
  // false = radar observé (historique), true = prévision (nowcast : extrapolation du mouvement des
  // précipitations, expérimentale côté fournisseur).
  is_forecast: boolean;
  tileUrlTemplate: string; // {z}/{x}/{y}, convention XYZ standard (pas de flipY)
}

export type RadarPrecipitation = {
  source: string; // "LibreWXR" (remplaçant compatible de l'API RainViewer v2)
  // Une frame par pas de 10 min, triées chronologiquement : ~12 frames d'historique (~2h), toujours
  // présentes, puis ~6 frames de prévision (~1h), qui peuvent manquer si le nowcast du fournisseur
  // est indisponible. Ne jamais supposer un nombre fixe de frames : se fier à `is_forecast`.
  frames: RadarFrame[];
}

export type RadarClouds = {
  source: string; // "OpenWeatherMap"
  tileUrlTemplate: string; // vue instantanée, pas d'historique ni de prévision — contient la clé OWM en clair (voulu, route protégée côté API)
}

export type RadarData = {
  generated: string; // ISO
  precipitation: RadarPrecipitation;
  clouds: RadarClouds;
}
