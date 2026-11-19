export type ImfLevel = "strong_south" | "south" | "north";

export type ImfPoint = {
  time_tag: string;
  bt: number; // nT, intensité totale
  bz: number; // nT, composante nord/sud — négatif = favorable aux aurores
  auroraFavorable: boolean;
  level: ImfLevel; // identifiant à traduire (tools/spaceWeather:magneticField.level.<level>) — remplace label
}

export type ImfData = {
  current: ImfPoint;
  history: ImfPoint[]; // ~2h de points
}
