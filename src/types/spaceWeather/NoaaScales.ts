export type NoaaScaleLevel = {
  scale: string; // "G0".."G5" | "R0".."R5" | "S0".."S5" selon la catégorie
  label: string;
}

export type NoaaScalesEntry = {
  date: string;
  geomagnetic: NoaaScaleLevel; // G0..G5
  radioBlackout: NoaaScaleLevel; // R0..R5
  solarRadiation: NoaaScaleLevel; // S0..S5
}

export type NoaaScalesData = {
  current: NoaaScalesEntry;
  forecast: NoaaScalesEntry[]; // 3 prochains jours
}
