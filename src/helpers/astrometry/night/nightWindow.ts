import {
  convertEquatorialToHorizontal,
  getSolarEquatorialCoordinate,
  type EquatorialCoordinate,
  type GeographicCoordinate,
} from "@observerly/astrometry";
import { findNextHorizonCrossing, findPreviousHorizonCrossing } from "../altitude/altitudeCurve";

// Seuil de la nuit astronomique (même seuil que SpaceWeatherScreen/WeatherScreen) : en dessous, le
// ciel est assez sombre pour que l'observation ait un sens.
const ASTRONOMICAL_NIGHT_THRESHOLD = -18;

export interface AstronomicalNightWindow {
  start: Date; // crépuscule astronomique du soir
  end: Date; // aube astronomique du matin
  isCurrentlyNight: boolean;
}

// Fenêtre de nuit astronomique encadrant `now` : si on y est déjà, le début est dans le passé (le
// crépuscule le plus récent, via findPreviousHorizonCrossing) et la fin dans le futur (la prochaine
// aube) ; sinon (en plein jour), les deux sont dans le futur — le prochain crépuscule puis l'aube
// qui suit. Retourne `null` si le Soleil ne descend jamais sous le seuil ce jour-là (été/haute
// latitude) — pas de nuit astronomique à afficher.
export const getAstronomicalNightWindow = (now: Date, observer: GeographicCoordinate): AstronomicalNightWindow | null => {
  const { alt } = convertEquatorialToHorizontal(now, observer, getSolarEquatorialCoordinate(now));
  const isCurrentlyNight = alt < ASTRONOMICAL_NIGHT_THRESHOLD;

  const start = isCurrentlyNight
    ? findPreviousHorizonCrossing(now, observer, getSolarEquatorialCoordinate, "set", ASTRONOMICAL_NIGHT_THRESHOLD)
    : findNextHorizonCrossing(now, observer, getSolarEquatorialCoordinate, "set", ASTRONOMICAL_NIGHT_THRESHOLD);
  // Cherché depuis `now` dans les deux cas : en pleine nuit comme en plein jour, le prochain
  // franchissement vers le haut du seuil est toujours la bonne aube (voir le raisonnement équivalent
  // dans getVisibilityWindow ci-dessous).
  const end = findNextHorizonCrossing(now, observer, getSolarEquatorialCoordinate, "rise", ASTRONOMICAL_NIGHT_THRESHOLD);

  if (!start || !end) return null;
  return { start, end, isCurrentlyNight };
};

export interface VisibilityWindow {
  start: Date; // lever
  end: Date; // coucher
  isCurrentlyVisible: boolean;
}

// Fenêtre "au-dessus de l'horizon" (ou de `thresholdAltitude`) encadrant `at`, pour un corps
// quelconque (Soleil, Lune...) dont on fournit la position équatoriale à un instant donné — même
// principe que getAstronomicalNightWindow, mais pour un passage AU-DESSUS du seuil (lever → coucher)
// plutôt qu'en dessous. Le coucher cherché depuis `at` (plutôt que depuis le lever trouvé) donne
// toujours le bon résultat dans les deux cas : si le corps est déjà levé, c'est le prochain coucher ;
// s'il est couché, le prochain lever arrive forcément avant tout prochain coucher (ils alternent),
// donc le coucher cherché depuis `at` tombe après ce lever, pas avant.
export const getVisibilityWindow = (
  at: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  thresholdAltitude: number = 0
): VisibilityWindow | null => {
  const { alt } = convertEquatorialToHorizontal(at, observer, getEquatorialCoordinate(at));
  const isCurrentlyVisible = alt >= thresholdAltitude;

  const start = isCurrentlyVisible
    ? findPreviousHorizonCrossing(at, observer, getEquatorialCoordinate, "rise", thresholdAltitude)
    : findNextHorizonCrossing(at, observer, getEquatorialCoordinate, "rise", thresholdAltitude);
  const end = findNextHorizonCrossing(at, observer, getEquatorialCoordinate, "set", thresholdAltitude);

  if (!start || !end) return null;
  return { start, end, isCurrentlyVisible };
};
