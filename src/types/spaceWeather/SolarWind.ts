export type SolarWindLevel = "slow" | "moderate" | "fast" | "very_fast";

export type SolarWindPoint = {
  time_tag: string;
  speed: number; // km/s
  density: number | null;
  temperature: number | null;
  level: SolarWindLevel;
  label: string; // déjà en FR, prêt à afficher
}

export type SolarWindData = {
  current: SolarWindPoint;
  history: SolarWindPoint[]; // ~2h de points
}
