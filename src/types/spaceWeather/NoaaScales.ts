// Identifiant partagé entre les 3 catégories (pas de "label" par catégorie comme avant) — à traduire
// via tools/spaceWeather:scales.severity.<label>.
export type NoaaSeverity = "none" | "minor" | "moderate" | "strong" | "severe" | "extreme" | "unknown";

export type NoaaScaleLevel = {
  scale: string; // "G0".."G5" | "R0".."R5" | "S0".."S5" selon la catégorie
  label: NoaaSeverity;
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
