import type { TransitInstance } from "@observerly/astrometry";
import type { TFunction } from "i18next";
import type { Dayjs } from "dayjs";
import { convertAzimuthToCardinalDirection } from "./location/convert";
import type { FormatDate } from "../hooks/useAppUnits";

// Mois abrégé de la langue de l'app, sans le point final, pour les pastilles de date (jour au-dessus
// du mois, affiché en majuscules) : "janv" en français, "jan" en anglais, "gen" en italien. Reçoit
// une date déjà passée par `formatDate` (useAppUnits) pour respecter le fuseau de l'utilisateur.
// Pas tronqué à 3 lettres : "juin" et "juillet" donneraient tous deux "jui".
export const formatShortMonth = (date: Dayjs): string => date.format("MMM").replace(/\.$/, "");

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


// Affiche l'heure + le point cardinal d'un lever/coucher, avec un préfixe "Hier"/"Demain" si le
// transit ne tombe pas le même jour civil que `referenceDate` (voir la section "transit" de
// moon.json). `formatDate` est injectée (plutôt que d'importer dayjs directement) pour respecter
// le réglage UTC/heure locale de l'utilisateur — voir useAppUnits.
export const formatTransit = (
  transit: TransitInstance | boolean | undefined,
  t: TFunction,
  formatDate: FormatDate,
  referenceDate: Date
): string => {
  if (transit === undefined) return t("transit.loading");
  if (transit === false) return t("transit.notApplicable");
  if (transit === true) return t("transit.neverSets");

  const time = formatDate(transit.datetime).format("HH:mm");
  const direction = convertAzimuthToCardinalDirection(transit.az);
  const dayDiff = formatDate(transit.datetime).startOf("day").diff(formatDate(referenceDate).startOf("day"), "day");

  if (dayDiff === -1) return t("transit.yesterday", { time, direction });
  if (dayDiff === 1) return t("transit.tomorrow", { time, direction });
  return t("transit.today", { time, direction });
};

// Affiche l'heure de début (ou de fin, si `until` est vrai) d'une fenêtre temporelle (ex: nuit
// astronomique) avec préfixe relatif au jour civil de `referenceDate`, même esprit que formatTransit
// mais sans azimut — et avec une variante "jusqu'à" pour le cas où l'évènement est déjà en cours
// (ex: on est déjà en nuit astronomique : on veut savoir jusqu'à quand, pas depuis quand).
export const formatDayRelativeTime = (
  date: Date | undefined,
  until: boolean,
  t: TFunction,
  formatDate: FormatDate,
  referenceDate: Date
): string => {
  if (!date) return t("transit.notApplicable");

  const time = formatDate(date).format("HH:mm");
  const dayDiff = formatDate(date).startOf("day").diff(formatDate(referenceDate).startOf("day"), "day");
  const day = dayDiff === -1 ? "Yesterday" : dayDiff === 1 ? "Tomorrow" : "Today";

  return t(`dayRelativeTime.${until ? "until" : "starts"}${day}`, { time });
};

// Formate une durée en secondes en "XXhYYmin" (ex: 45296 → "12h 34min"). `t` est injectée comme
// pour formatTransit : chaque namespace appelant doit déclarer sa propre clé "duration" (même
// convention que "transit" dans moon.json/tools/spaceWeather.json), pour permettre un libellé
// différent par langue (ex: "min" vs "m").
export const formatDuration = (seconds: number, t: TFunction): string => {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return t("duration", { hours, minutes });
};

// Durée compacte à partir d'un nombre de minutes : "50 min" sous l'heure, puis "1h10", "1h05" (minutes
// sur deux chiffres) ou "2h" pile. Arrondie à la minute ; une durée négative (ex: fin avant le
// début dans un formulaire) garde son signe : "-30 min". Sans traduction, comme formatHumidity ou
// formatWindSpeed — pour un libellé traduit par namespace, voir formatDuration ci-dessus.
export const formatCompactDuration = (minutes: number): string => {
  const sign = minutes < 0 ? "-" : "";
  const totalMinutes = Math.round(Math.abs(minutes));
  if (totalMinutes < 60) return `${sign}${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return remainingMinutes === 0
    ? `${sign}${hours}h`
    : `${sign}${hours}h${String(remainingMinutes).padStart(2, "0")}`;
};

export const formatDistanceInUA = (meters: number, language: string, decimals = 2): string => {
  const AU_IN_METERS = 149_597_870_700; // 1 UA = 149 597 870,7 km
  const distanceInAU = meters / AU_IN_METERS;
  return `${formatLocaleNumber(distanceInAU, language, decimals)} UA`;
}

export const formatHumidity = (percent: number): string => `${Math.round(percent)}%`;

// OpenWeather renvoie wind_speed en m/s (c'est ce que l'API appelle "metric", malgré son nom —
// elle ne convertit pas en km/h) : conversion ×3.6 nécessaire avant tout affichage en km/h, sans
// quoi la valeur brute en m/s est affichée telle quelle sous une étiquette "km/h" trompeuse.
export const formatWindSpeed = (metersPerSecond: number): string => `${Math.round(metersPerSecond * 3.6)} km/h`;


export const captitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);