export type SolarFlareCategory = "A" | "B" | "C" | "M" | "X";

// Identifiant d'intensité, indépendant de `category` (la lettre de classe) — à traduire via
// tools/spaceWeather:solarFlares.activity.<label>.
export type SolarFlareActivity = "very_low" | "low" | "moderate" | "significant_flare" | "major_flare" | "unknown";

export type SolarFlareCurrent = {
  time_tag: string;
  class: string; // ex: "B5.3"
  category: SolarFlareCategory;
  label: SolarFlareActivity; // remplace le texte FR déjà traduit
}

export type SolarFlaresData = {
  current: SolarFlareCurrent;
}
