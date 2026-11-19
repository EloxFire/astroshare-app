// Identifiant à traduire (tools/spaceWeather:imagery.wavelengths.<label>) — remplace le texte FR
// déjà traduit que l'API renvoyait avant.
export type SunWavelengthLabel =
  | "visible_light"
  | "magnetogram"
  | "chromosphere"
  | "quiet_corona"
  | "corona_active_regions"
  | "active_regions"
  | "flares"
  | "active_regions_hot"
  | "transition_region"
  | "photosphere";

export type SunImage = {
  wavelength: string;
  label: SunWavelengthLabel;
  imageUrl: string;
  animationUrl: string; // .mp4, boucle silencieuse
}

export type SunCorona = {
  label: "corona"; // toujours cette valeur fixe
  time_tag: string;
  imageUrl: string;
  animationUrl: string; // .mp4, boucle 24h
}

export type SunImagery = {
  images: SunImage[]; // 10 longueurs d'onde
  corona: SunCorona;
}
