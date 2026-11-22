import { convertEquatorialToHorizontal, EquatorialCoordinate, GeographicCoordinate } from "@observerly/astrometry";

export interface AltitudePoint {
  date: Date;
  altitude: number; // degrés au-dessus de l'horizon (négatif = sous l'horizon)
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_STEP_MINUTES = 15;

// Échantillonne l'altitude d'un objet au-dessus de l'horizon de date-4h à date+24h (fenêtre fixe,
// pensée pour "ce soir" : couvre l'après-midi et les 24h qui suivent, soit plus d'un cycle
// complet jour/nuit).
//
// getEquatorialCoordinate est une fonction (plutôt qu'une coordonnée fixe) pour supporter les
// objets du système solaire (Lune, planètes), dont la position se déplace sensiblement sur une
// fenêtre de 28h — recalculée à chaque échantillon. Pour une étoile fixe, passer simplement
// () => ({ ra, dec }) (position quasi constante à cette échelle de temps).
export const getAltitudeCurve = (
  date: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  stepMinutes: number = DEFAULT_STEP_MINUTES
): AltitudePoint[] => {
  const startTime = date.getTime() - 4 * ONE_HOUR_MS;
  const endTime = date.getTime() + 24 * ONE_HOUR_MS;
  const stepMs = stepMinutes * 60 * 1000;

  const points: AltitudePoint[] = [];
  for (let time = startTime; time <= endTime; time += stepMs) {
    const sampleDate = new Date(time);
    const target = getEquatorialCoordinate(sampleDate);
    const { alt } = convertEquatorialToHorizontal(sampleDate, observer, target);
    points.push({ date: sampleDate, altitude: alt });
  }

  return points;
};

// Point le plus haut d'une courbe d'altitude (ex. getAltitudeCurve), affiné par interpolation
// parabolique autour de l'échantillon maximal plutôt que de prendre sa date/altitude brutes :
// getAltitudeCurve échantillonne toutes les 15 min à partir de "maintenant" (fenêtre glissante, pas
// une grille fixe), donc la grille d'échantillons se décale d'un refresh à l'autre — sans affinage,
// la culmination "saute" d'un échantillon à l'autre (jusqu'à ±7-8 min) selon la phase de la grille
// au moment du calcul, pas une vraie variation de la position du ciel. Formule standard du sommet
// d'une parabole passant par 3 points également espacés. Extrait d'AltitudeChart (comportement
// inchangé) pour être réutilisé hors de ce composant (ex. carte Lune de la recherche globale).
export const getCulmination = (points: AltitudePoint[]): { date: Date; altitude: number } | null => {
  if (points.length === 0) return null;

  let culminationIndex = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].altitude > points[culminationIndex].altitude) culminationIndex = i;
  }

  let date = points[culminationIndex].date;
  let altitude = points[culminationIndex].altitude;
  const prevPoint = points[culminationIndex - 1];
  const nextPoint = points[culminationIndex + 1];
  if (prevPoint && nextPoint) {
    const y0 = prevPoint.altitude;
    const y1 = altitude;
    const y2 = nextPoint.altitude;
    const curvature = y0 - 2 * y1 + y2;
    if (Math.abs(curvature) > 1e-6) {
      const offset = (0.5 * (y0 - y2)) / curvature; // en unités d'indices d'échantillon, ~[-0.5, 0.5]
      const stepMs = nextPoint.date.getTime() - date.getTime();
      date = new Date(date.getTime() + offset * stepMs);
      altitude = y1 - 0.25 * (y0 - y2) * offset;
    }
  }

  return { date, altitude };
};

// getBodyNextRise/getBodyNextSet d'Observerly ne renvoient jamais que le PROCHAIN évènement après
// `date`, jamais le précédent. Pour une "trajectoire du jour", c'est insuffisant : si l'objet est
// déjà levé, on veut afficher l'heure à laquelle il s'est levé (déjà passée), pas son prochain
// lever (potentiellement le lendemain). Ceci cherche, en remontant dans le temps depuis `date`, le
// dernier passage par `thresholdAltitude` (lever ou coucher, 0° par défaut — passer -18° par
// exemple pour la nuit astronomique) avant `date` — par interpolation linéaire entre les deux
// échantillons qui l'encadrent, comme getAltitudeCurve/AltitudeChart pour la portion affichée.
//
// lookbackHours doit couvrir au moins un cycle complet lever/coucher de l'objet (~24h50 pour la
// Lune) pour garantir qu'un évènement soit trouvé ; la valeur par défaut (30h) laisse une marge.
export const findPreviousHorizonCrossing = (
  date: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  direction: "rise" | "set",
  thresholdAltitude: number = 0,
  lookbackHours: number = 30,
  stepMinutes: number = DEFAULT_STEP_MINUTES
): Date | undefined => {
  const stepMs = stepMinutes * 60 * 1000;
  const startTime = date.getTime() - lookbackHours * ONE_HOUR_MS;

  let previous: { date: Date; altitude: number } | undefined;
  let found: Date | undefined;

  for (let time = startTime; time <= date.getTime(); time += stepMs) {
    const sampleDate = new Date(time);
    const target = getEquatorialCoordinate(sampleDate);
    const { alt } = convertEquatorialToHorizontal(sampleDate, observer, target);

    if (previous) {
      const rising = previous.altitude < thresholdAltitude && alt >= thresholdAltitude;
      const setting = previous.altitude >= thresholdAltitude && alt < thresholdAltitude;
      if ((direction === "rise" && rising) || (direction === "set" && setting)) {
        const ratio = (thresholdAltitude - previous.altitude) / (alt - previous.altitude);
        // On continue la boucle même après une trouvaille : on veut la DERNIÈRE avant `date`.
        found = new Date(previous.date.getTime() + ratio * (sampleDate.getTime() - previous.date.getTime()));
      }
    }

    previous = { date: sampleDate, altitude: alt };
  }

  return found;
};

// Symétrique de findPreviousHorizonCrossing : cherche, en avançant dans le temps depuis `date`, le
// PROCHAIN passage par `thresholdAltitude`. Contrairement à getTwilightBandsForDay d'Observerly
// (qui calcule sur une fenêtre minuit UTC → minuit UTC, décalée par rapport au jour civil de
// l'observateur et donc susceptible de tronquer l'évènement recherché pour un fuseau ≠ UTC), ceci
// cherche directement autour de `date`, quel que soit le fuseau.
export const findNextHorizonCrossing = (
  date: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  direction: "rise" | "set",
  thresholdAltitude: number = 0,
  lookaheadHours: number = 30,
  stepMinutes: number = DEFAULT_STEP_MINUTES
): Date | undefined => {
  const stepMs = stepMinutes * 60 * 1000;
  const endTime = date.getTime() + lookaheadHours * ONE_HOUR_MS;

  let previous: { date: Date; altitude: number } | undefined;

  for (let time = date.getTime(); time <= endTime; time += stepMs) {
    const sampleDate = new Date(time);
    const target = getEquatorialCoordinate(sampleDate);
    const { alt } = convertEquatorialToHorizontal(sampleDate, observer, target);

    if (previous) {
      const rising = previous.altitude < thresholdAltitude && alt >= thresholdAltitude;
      const setting = previous.altitude >= thresholdAltitude && alt < thresholdAltitude;
      if ((direction === "rise" && rising) || (direction === "set" && setting)) {
        const ratio = (thresholdAltitude - previous.altitude) / (alt - previous.altitude);
        return new Date(previous.date.getTime() + ratio * (sampleDate.getTime() - previous.date.getTime()));
      }
    }

    previous = { date: sampleDate, altitude: alt };
  }

  return undefined;
};
