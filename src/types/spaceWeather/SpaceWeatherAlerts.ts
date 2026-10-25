export type SpaceWeatherAlert = {
  type: string; // code produit NOAA
  issuedAt: string;
  summary: string; // 1 ligne, prêt à afficher
  details: string; // texte complet
}

export type SpaceWeatherAlertsData = {
  data: SpaceWeatherAlert[]; // 20 plus récentes, triées décroissant
}
