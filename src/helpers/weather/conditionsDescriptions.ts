import { Thermometer, ThermometerSnowflake, ThermometerSun, type LucideIcon } from "lucide-react-native";

export type TemperatureDescriptionKey = "cold" | "cool" | "mild" | "warm" | "hot";

// Seuils indicatifs sur la température ressentie en extérieur (°C), pour une nuit d'observation.
export const getTemperatureDescriptionKey = (temperatureCelsius: number): TemperatureDescriptionKey => {
  if (temperatureCelsius < 0) return "cold";
  if (temperatureCelsius < 10) return "cool";
  if (temperatureCelsius < 20) return "mild";
  if (temperatureCelsius < 28) return "warm";
  return "hot";
}

// Icône assortie à la même clé que getTemperatureDescriptionKey, pour que le pictogramme et le
// texte évoluent toujours ensemble selon la valeur.
export const getTemperatureIcon = (descriptionKey: TemperatureDescriptionKey): LucideIcon => {
  if (descriptionKey === "cold" || descriptionKey === "cool") return ThermometerSnowflake;
  if (descriptionKey === "warm" || descriptionKey === "hot") return ThermometerSun;
  return Thermometer;
}

export type MoonIlluminationDescriptionKey = "new" | "crescent" | "quarter" | "gibbous" | "full";

// Seuils indicatifs sur le taux d'illumination lunaire (%), pour une description qualitative
// rapide — distincte du nom de phase précis (getLunarPhaseLabel), basé lui sur l'âge de la Lune.
export const getMoonIlluminationDescriptionKey = (illuminationPercent: number): MoonIlluminationDescriptionKey => {
  if (illuminationPercent < 10) return "new";
  if (illuminationPercent < 40) return "crescent";
  if (illuminationPercent < 60) return "quarter";
  if (illuminationPercent < 90) return "gibbous";
  return "full";
}
