import { convertEquatorialToHorizontal, EquatorialCoordinate, GeographicCoordinate } from "@observerly/astrometry";

export interface AltitudePoint {
  date: Date;
  altitude: number; // degrés au-dessus de l'horizon (négatif = sous l'horizon)
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_STEP_MINUTES = 15;

// Échantillonne l'altitude d'un objet au-dessus de l'horizon de date-1h à date+12h (fenêtre fixe,
// pensée pour "ce soir" : couvre la fin d'après-midi et toute la nuit qui suit).
//
// getEquatorialCoordinate est une fonction (plutôt qu'une coordonnée fixe) pour supporter les
// objets du système solaire (Lune, planètes), dont la position se déplace sensiblement sur une
// fenêtre de 13h — recalculée à chaque échantillon. Pour une étoile fixe, passer simplement
// () => ({ ra, dec }) (position quasi constante à cette échelle de temps).
export const getAltitudeCurve = (
  date: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  stepMinutes: number = DEFAULT_STEP_MINUTES
): AltitudePoint[] => {
  const startTime = date.getTime() - ONE_HOUR_MS;
  const endTime = date.getTime() + 12 * ONE_HOUR_MS;
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
