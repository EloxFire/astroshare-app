import {
  getBodyNextRise,
  getBodyNextSet,
  isBodyAboveHorizon,
  getLunarAge as observerlyGetLunarAge,
  getLunarAngularDiameter as observerlyGetLunarAngularDiameter,
  getLunarAnnualEquationCorrection as observerlyGetLunarAnnualEquationCorrection,
  getLunarArgumentOfLatitude as observerlyGetLunarArgumentOfLatitude,
  getLunarBrownLunationNumber as observerlyGetLunarBrownLunationNumber,
  getLunarCorrectedEclipticLongitudeOfTheAscendingNode as observerlyGetLunarCorrectedEclipticLongitudeOfTheAscendingNode,
  getLunarDistance as observerlyGetLunarDistance,
  getLunarEclipticCoordinate as observerlyGetLunarEclipticCoordinate,
  getLunarEclipticLatitude as observerlyGetLunarEclipticLatitude,
  getLunarEclipticLongitude as observerlyGetLunarEclipticLongitude,
  getLunarElongation as observerlyGetLunarElongation,
  getLunarEquatorialCoordinate as observerlyGetLunarEquatorialCoordinate,
  getLunarEvectionCorrection as observerlyGetLunarEvectionCorrection,
  getLunarIllumination as observerlyGetLunarIllumination,
  getLunarMeanAnomaly as observerlyGetLunarMeanAnomaly,
  getLunarMeanAnomalyCorrection as observerlyGetLunarMeanAnomalyCorrection,
  getLunarMeanEclipticLongitude as observerlyGetLunarMeanEclipticLongitude,
  getLunarMeanEclipticLongitudeOfTheAscendingNode as observerlyGetLunarMeanEclipticLongitudeOfTheAscendingNode,
  getLunarMeanGeometricLongitude as observerlyGetLunarMeanGeometricLongitude,
  getLunarPhase as observerlyGetLunarPhase,
  getLunarPhaseAngle as observerlyGetLunarPhaseAngle,
  getLunarTrueAnomaly as observerlyGetLunarTrueAnomaly,
  getLunarTrueEclipticLongitude as observerlyGetLunarTrueEclipticLongitude,
  getNextFullMoon as observerlyGetNextFullMoon,
  getNextNewMoon as observerlyGetNextNewMoon,
  isBlueMoon as observerlyIsBlueMoon,
  isFullMoon as observerlyIsFullMoon,
  isNewMoon as observerlyIsNewMoon,
  LUNAR_SYNODIC_MONTH,
  type EclipticCoordinate,
  type EquatorialCoordinate,
  type GeographicCoordinate,
  type Observer,
  type Phase,
  type TransitInstance,
} from "@observerly/astrometry";
import i18next from "../../i18n";

export type { EclipticCoordinate, EquatorialCoordinate, GeographicCoordinate, Observer, Phase, TransitInstance };
export { LUNAR_SYNODIC_MONTH };

export type LunarAge = {
  A: number;
  age: number;
};

export type LunarAngularDiameterObserver = GeographicCoordinate & { elevation: number };

// Point d'entrée unique vers observerly pour tout ce qui concerne la Lune :
// le reste de l'app ne doit jamais importer @observerly/astrometry directement.

export const getLunarAnnualEquationCorrection = (date: Date): number =>
  observerlyGetLunarAnnualEquationCorrection(date);

export const getLunarMeanAnomaly = (date: Date): number => observerlyGetLunarMeanAnomaly(date);

export const getLunarMeanGeometricLongitude = (date: Date): number =>
  observerlyGetLunarMeanGeometricLongitude(date);

export const getLunarArgumentOfLatitude = (date: Date): number => observerlyGetLunarArgumentOfLatitude(date);

export const getLunarMeanEclipticLongitude = (date: Date): number =>
  observerlyGetLunarMeanEclipticLongitude(date);

export const getLunarEvectionCorrection = (date: Date): number => observerlyGetLunarEvectionCorrection(date);

export const getLunarMeanEclipticLongitudeOfTheAscendingNode = (date: Date): number =>
  observerlyGetLunarMeanEclipticLongitudeOfTheAscendingNode(date);

export const getLunarMeanAnomalyCorrection = (date: Date): number =>
  observerlyGetLunarMeanAnomalyCorrection(date);

export const getLunarTrueAnomaly = (date: Date): number => observerlyGetLunarTrueAnomaly(date);

export const getLunarTrueEclipticLongitude = (date: Date): number =>
  observerlyGetLunarTrueEclipticLongitude(date);

export const getLunarCorrectedEclipticLongitudeOfTheAscendingNode = (date: Date): number =>
  observerlyGetLunarCorrectedEclipticLongitudeOfTheAscendingNode(date);

export const getLunarEclipticLongitude = (date: Date): number => observerlyGetLunarEclipticLongitude(date);

export const getLunarEclipticLatitude = (date: Date): number => observerlyGetLunarEclipticLatitude(date);

export const getLunarEclipticCoordinate = (date: Date): EclipticCoordinate =>
  observerlyGetLunarEclipticCoordinate(date);

export const getLunarEquatorialCoordinate = (date: Date): EquatorialCoordinate =>
  observerlyGetLunarEquatorialCoordinate(date);

export const getLunarElongation = (date: Date): number => observerlyGetLunarElongation(date);

export const getLunarAngularDiameter = (date: Date, observer?: LunarAngularDiameterObserver): number =>
  observerlyGetLunarAngularDiameter(date, observer);

export const getLunarDistance = (date: Date): number => observerlyGetLunarDistance(date);

export const getLunarAge = (date: Date): LunarAge => observerlyGetLunarAge(date);

export const getLunarPhaseAngle = (date: Date): number => observerlyGetLunarPhaseAngle(date);

export const getLunarIllumination = (date: Date): number => observerlyGetLunarIllumination(date);

export const getLunarPhase = (date: Date): Phase => observerlyGetLunarPhase(date);

export const getLunarBrownLunationNumber = (date: Date): number => observerlyGetLunarBrownLunationNumber(date);

export const isNewMoon = (date: Date): boolean => observerlyIsNewMoon(date);

export const getNextNewMoon = (date: Date): Date => observerlyGetNextNewMoon(date);

export const isFullMoon = (date: Date): boolean => observerlyIsFullMoon(date);

export const getNextFullMoon = (date: Date): Date => observerlyGetNextFullMoon(date);

export const isBlueMoon = (date: Date): boolean => observerlyIsBlueMoon(date);

// La lib expose getNextNewMoon/getNextFullMoon, mais pas d'équivalent pour les quartiers.
// getLunarAge(date).age donne l'âge de la Lune en jours DEPUIS LA DERNIÈRE NOUVELLE LUNE
// (donc borné entre 0 et LUNAR_SYNODIC_MONTH, et qui retombe à ~0 à chaque nouvelle lune) :
// Premier Quartier ≈ 1/4 de cycle, Pleine Lune ≈ 1/2, Dernier Quartier ≈ 3/4, Nouvelle ≈ 0/cycle.
// On cherche donc "la prochaine date où cet âge atteint X jours" par balayage + bissection.

const QUARTER_SEARCH_STEP_MS = 6 * 60 * 60 * 1000; // pas de balayage grossier : 6h
const QUARTER_SEARCH_PRECISION_MS = 60 * 60 * 1000; // précision finale visée : 1h (largement suffisant pour un affichage jour/heure)

// Affine par dichotomie l'intervalle [before, after] (où l'on sait que l'âge cherché se
// trouve) jusqu'à obtenir la précision voulue.
const bisectAgeCrossing = (before: Date, after: Date, targetAgeDays: number): Date => {
  let low = before;
  let high = after;
  while (high.getTime() - low.getTime() > QUARTER_SEARCH_PRECISION_MS) {
    const middle = new Date((low.getTime() + high.getTime()) / 2);
    if (getLunarAge(middle).age < targetAgeDays) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return high;
};

// Trouve la prochaine date après `fromDate` où l'âge de la Lune atteint `targetAgeDays`.
const findNextAgeCrossing = (fromDate: Date, targetAgeDays: number): Date => {
  let previousDate = fromDate;
  let previousAge = getLunarAge(previousDate).age;

  // Balayage grossier, jour par (petit bout de) jour, jusqu'à repérer l'intervalle où
  // l'âge franchit la cible. Deux cas possibles à chaque pas :
  // - l'âge dépasse la cible normalement (on a trouvé l'intervalle, on arrête ici) ;
  // - l'âge retombe brutalement (une Nouvelle Lune a eu lieu entre les deux dates) : la
  //   cible est déjà passée dans le cycle actuel, elle ne reviendra qu'au cycle suivant —
  //   on continue simplement le balayage, l'âge repart de ~0.
  for (;;) {
    const nextDate = new Date(previousDate.getTime() + QUARTER_SEARCH_STEP_MS);
    const nextAge = getLunarAge(nextDate).age;

    const targetReachedThisStep = previousAge < targetAgeDays && nextAge >= targetAgeDays;
    if (targetReachedThisStep) {
      return bisectAgeCrossing(previousDate, nextDate, targetAgeDays);
    }

    previousDate = nextDate;
    previousAge = nextAge;
  }
};

/**
 * getNextFirstQuarter()
 *
 * Le prochain Premier Quartier (≈ 1/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextFirstQuarter = (date: Date): Date => findNextAgeCrossing(date, LUNAR_SYNODIC_MONTH / 4);

/**
 * getNextLastQuarter()
 *
 * Le prochain Dernier Quartier (≈ 3/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextLastQuarter = (date: Date): Date => findNextAgeCrossing(date, (LUNAR_SYNODIC_MONTH * 3) / 4);

// La Lune met environ un jour lunaire (~24h50) entre deux levers (ou deux couchers)
// identiques : reculer de 30h avant de rechercher en avant garantit de retomber sur
// l'occurrence précédente, sans jamais remonter jusqu'à celle d'avant.
const PREVIOUS_TRANSIT_SEARCH_MARGIN_MS = 30 * 60 * 60 * 1000;

// BUG CONNU de @observerly/astrometry (confirmé en lisant node_modules/@observerly/astrometry/dist/temporal.js) :
// convertGreenwhichSiderealTimeToUniversalTime() calcule correctement une heure UTC, mais construit
// le Date final avec le constructeur LOCAL (`new Date(année, mois, jour, h, m, s)`) au lieu de
// `Date.UTC(...)`. Résultat : l'instant absolu retourné par getBodyNextRise/getBodyNextSet est décalé
// de l'offset UTC courant de l'appareil (ex: +2h en France l'été) par rapport à la vraie heure UTC du
// lever/coucher. Même bug déjà rencontré et corrigé dans la V2 d'AstroShare (voir sur la branche `main` :
// src/helpers/scripts/astro/objects/computeMoon.ts, qui fait `.add(localOffsetMinutes, 'minute')`).
// On applique ici la même correction, au plus près de la source, pour que le reste du code (formatage
// UTC/heure locale/fuseau choisi dans useAppUnits) reçoive un datetime déjà correct.
// NB : getNextNewMoon/getNextFullMoon/getLunarAge passent par un autre chemin de calcul dans la lib
// (recherche par pas de temps en millisecondes, pas de reconstruction de Date via année/mois/jour) et
// ne sont PAS concernées par ce bug — seuls le lever et le coucher le sont.
const fixObserverlyTransitDateBug = <T extends TransitInstance | boolean>(transit: T): T => {
  if (typeof transit !== "object") return transit; // `false`/`true` (jamais de lever/coucher) : rien à corriger
  const deviceUtcOffsetMs = -new Date().getTimezoneOffset() * 60 * 1000; // getTimezoneOffset() est signé à l'envers (UTC - local)
  return { ...transit, datetime: new Date(transit.datetime.getTime() + deviceUtcOffsetMs) };
};

/**
 * getLunarNextRise()
 *
 * Le prochain lever de Lune pour un observateur donné. Si la Lune est déjà levée
 * à `date` (donc son "prochain lever" au sens strict serait demain), on renvoie à
 * la place son lever précédent (celui en cours), plus pertinent à afficher.
 *
 * @returns Le lever (précédent ou suivant selon le cas), `false` si la Lune ne se
 * lève jamais pour cet observateur.
 */
export const getLunarNextRise = (date: Date, observer: Observer): TransitInstance | false => {
  const alreadyRisen = isBodyAboveHorizon(date, observer, getLunarEquatorialCoordinate(date));
  const searchFrom = alreadyRisen ? new Date(date.getTime() - PREVIOUS_TRANSIT_SEARCH_MARGIN_MS) : date;
  return fixObserverlyTransitDateBug(getBodyNextRise(searchFrom, observer, getLunarEquatorialCoordinate(searchFrom)));
};

/**
 * getLunarNextSet()
 *
 * Le prochain coucher de Lune pour un observateur donné. Si la Lune est déjà
 * couchée à `date` (donc son "prochain coucher" au sens strict serait après le
 * prochain lever, potentiellement demain), on renvoie à la place son coucher
 * précédent — pour toujours afficher une paire cohérente avec `getLunarNextRise`
 * (levée → lever précédent + coucher suivant ; couchée → coucher précédent + lever suivant).
 *
 * @returns Le coucher (précédent ou suivant selon le cas), `true` si la Lune ne se
 * couche jamais (circumpolaire) pour cet observateur, `false` si elle ne se lève jamais.
 */
export const getLunarNextSet = (date: Date, observer: Observer): TransitInstance | boolean => {
  const alreadySet = !isBodyAboveHorizon(date, observer, getLunarEquatorialCoordinate(date));
  const searchFrom = alreadySet ? new Date(date.getTime() - PREVIOUS_TRANSIT_SEARCH_MARGIN_MS) : date;
  return fixObserverlyTransitDateBug(getBodyNextSet(searchFrom, observer, getLunarEquatorialCoordinate(searchFrom)));
};

// Traduit via i18next (namespace "moon", clé "phases.<Phase>") plutôt qu'un dictionnaire
// FR en dur — voir src/i18n/locales/{fr,en,it}/moon.json. i18next.t() marche hors composant
// React (pas de hook nécessaire) ; la réactivité au changement de langue vient du composant
// appelant, qui doit lui-même utiliser useTranslation() pour se re-render.
export const getLunarPhaseLabel = (phase: Phase): string => i18next.t(`phases.${phase}`, { ns: "moon" });
