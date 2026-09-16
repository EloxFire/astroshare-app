// Insère une espace tous les 3 chiffres (ex: 384 400 → "384 400") — utilisé pour l'affichage
// de grandes distances (ex: distance Terre-Lune en km).
export const formatWithSpaces = (value: number): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Séparateurs de milliers/décimales par langue (codes ISO 639-1, voir helpers/langs.ts). Codé en
// dur plutôt que via Intl.NumberFormat : l'app évite volontairement les API Intl un peu poussées
// à cause du support ICU incomplet de Hermes (voir le commentaire dans helpers/timezones.ts pour
// le précédent avec Intl.supportedValuesOf) — Intl.NumberFormat est plus basique et probablement
// fiable, mais pas vérifié dans ce projet, donc on reste sur du formatage maison par prudence.
const NUMBER_SEPARATORS_BY_LANGUAGE: Record<string, { thousands: string; decimal: string }> = {
  fr: { thousands: " ", decimal: "," },
  it: { thousands: ".", decimal: "," },
  en: { thousands: ",", decimal: "." },
};

const DEFAULT_NUMBER_SEPARATORS = NUMBER_SEPARATORS_BY_LANGUAGE.en;

// Formate un nombre avec les séparateurs de milliers/décimales de `language` (ex: 384400.5 en
// "fr" → "384 400,5", en "en" → "384,400.5", en "it" → "384.400,5").
export const formatLocaleNumber = (value: number, language: string, decimals = 0): string => {
  const { thousands, decimal } = NUMBER_SEPARATORS_BY_LANGUAGE[language] ?? DEFAULT_NUMBER_SEPARATORS;
  const [integerPart, decimalPart] = value.toFixed(decimals).split(".");
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return decimalPart ? `${groupedInteger}${decimal}${decimalPart}` : groupedInteger;
};

// Convertit une distance en mètres vers un affichage en km, localisé selon `language` (ex:
// 384400000 en "fr" → "384 400 km", en "en" → "384,400 km", en "it" → "384.400 km").
export const formatDistanceInKm = (meters: number, language: string, decimals = 0): string =>
  `${formatLocaleNumber(meters / 1000, language, decimals)} km`;
