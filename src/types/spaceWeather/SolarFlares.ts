export type SolarFlareCategory = "A" | "B" | "C" | "M" | "X";

export type SolarFlareCurrent = {
  time_tag: string;
  class: string; // ex: "B5.3"
  category: SolarFlareCategory;
  label: string; // déjà en FR, prêt à afficher
}

export type SolarFlaresData = {
  current: SolarFlareCurrent;
}
