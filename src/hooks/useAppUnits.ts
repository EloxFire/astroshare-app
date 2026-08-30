import dayjs from "dayjs";
import { useUserDataStore } from "../store/userData.store";

// Type exporté pour les fonctions pures hors composant (ex: formatTransit dans
// MoonCalendarScreen) qui ont besoin de recevoir `formatDate` en paramètre plutôt
// que d'appeler dayjs() directement.
export type FormatDate = (date?: dayjs.ConfigType) => dayjs.Dayjs;

// Regroupe tout ce qui dépend des préférences d'unités de l'utilisateur (heure UTC/locale,
// distance km/mi, température °C/°F) derrière un seul hook. Comme `units` est lu via un
// sélecteur Zustand, ce hook est réactif : dès que l'utilisateur change une préférence
// (setTimeUnit/setDistanceUnit/setTemperatureUnit), tout composant qui utilise useAppUnits()
// se re-render automatiquement avec les nouvelles valeurs.
//
// Point important : contrairement à la langue (dayjs.locale() est un vrai réglage global de
// la librairie), dayjs n'a pas de "mode global UTC". Il faut donc que TOUT le code qui affiche
// une date passe par `formatDate` ci-dessous plutôt que d'appeler `dayjs()` directement — sinon
// le réglage utilisateur est silencieusement ignoré à cet endroit-là.
export const useAppUnits = () => {
  const units = useUserDataStore((state) => state.units);

  // Remplace tout `dayjs(...)`. Trois cas, dans cet ordre de priorité :
  // 1. "utc" : toujours en UTC, quel que soit le fuseau choisi.
  // 2. "local" + un fuseau explicite choisi par l'utilisateur (units.timezone) : ce
  //    fuseau prime sur celui de l'appareil — utile quand l'observateur (position GPS ou
  //    observatoire enregistré) n'est pas physiquement dans le même fuseau que le téléphone,
  //    sinon les heures de lever/coucher de Lune affichées seraient fausses.
  // 3. "local" sans fuseau choisi : comportement par défaut, fuseau de l'appareil.
  // S'utilise ensuite exactement comme dayjs() (`.format(...)`, `.diff(...)`, `.isAfter(...)`, etc.).
  const formatDate: FormatDate = (date) => {
    if (units.time === "utc") return dayjs.utc(date);
    if (units.timezone) return dayjs.tz(date, units.timezone);
    return dayjs(date);
  };

  // `km` est toujours l'unité de stockage interne (ex: distance Terre-Lune) ; on ne
  // convertit qu'à l'affichage, jamais dans les calculs eux-mêmes.
  const formatDistanceKm = (km: number): string =>
    units.distance === "mi" ? `${(km * 0.621371).toFixed(1)} mi` : `${km.toFixed(1)} km`;

  // Même principe : la température est toujours stockée/calculée en °C, la conversion
  // en °F n'a lieu qu'au moment de l'affichage.
  const formatTemperatureCelsius = (celsius: number): string =>
    units.temperature === "fahrenheit" ? `${(celsius * 9 / 5 + 32).toFixed(0)}°F` : `${celsius.toFixed(0)}°C`;

  return { formatDate, formatDistanceKm, formatTemperatureCelsius };
};
