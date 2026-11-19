// Identifiant à traduire (tools/spaceWeather:auroraForecast.here.<label>) — seuils maison côté API,
// pas une échelle officielle NOAA.
export type AuroraProbabilityLabel = "unlikely" | "possible" | "likely" | "high";

export type AuroraImageId = "ovation.north" | "ovation.south" | "dashboard.north" | "dashboard.south";

export type AuroraImage = {
  id: AuroraImageId;
  imageUrl: string; // lien CDN NOAA direct, à afficher tel quel (pas de proxy)
}

// Présent seulement si lat/lon ont été passés à la requête.
export type AuroraHereForecast = {
  probability: number; // valeur du modèle au point de grille le plus proche (grille 1°) — 0 à ~39 en période calme, plus en tempête
  label: AuroraProbabilityLabel;
}

export type AuroraForecast = {
  images: AuroraImage[];
  observationTime: string;
  forecastTime: string; // ≈ observationTime + 1h : prévision à court terme, pas l'instant présent
  here?: AuroraHereForecast;
}
