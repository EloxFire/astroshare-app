import { convertEquatorialToHorizontal, type EquatorialCoordinate, type GeographicCoordinate } from "@observerly/astrometry";

export interface VisibilitySegment {
  startPercent: number; // 0-100 dans la fenêtre [from, to]
  endPercent: number;
}

const DEFAULT_STEP_MINUTES = 15;

// Échantillonne l'altitude d'un corps entre `from` et `to`, et regroupe les échantillons consécutifs
// qui vérifient `isInSegment` en segments continus (en % de la fenêtre, directement utilisables pour
// positionner une barre dans une piste horizontale). Contrairement à findNextHorizonCrossing/
// findPreviousHorizonCrossing (qui cherchent UN SEUL franchissement précis), ceci donne TOUS les
// segments dans la fenêtre — nécessaire pour dessiner une piste jour/nuit complète (un corps peut
// avoir zéro, un, ou deux segments visibles dans une fenêtre de 24h, ex: la Lune à cheval sur minuit).
export const getVisibilitySegments = (
  from: Date,
  to: Date,
  observer: GeographicCoordinate,
  getEquatorialCoordinate: (atDate: Date) => EquatorialCoordinate,
  isInSegment: (altitude: number) => boolean,
  stepMinutes: number = DEFAULT_STEP_MINUTES
): VisibilitySegment[] => {
  const totalMs = to.getTime() - from.getTime();
  if (totalMs <= 0) return [];
  const stepMs = stepMinutes * 60 * 1000;

  const segments: VisibilitySegment[] = [];
  let segmentStartMs: number | null = null;

  for (let time = from.getTime(); time <= to.getTime(); time += stepMs) {
    const date = new Date(time);
    const { alt } = convertEquatorialToHorizontal(date, observer, getEquatorialCoordinate(date));
    const inSegment = isInSegment(alt);

    if (inSegment && segmentStartMs === null) {
      segmentStartMs = time;
    } else if (!inSegment && segmentStartMs !== null) {
      segments.push({
        startPercent: ((segmentStartMs - from.getTime()) / totalMs) * 100,
        endPercent: ((time - from.getTime()) / totalMs) * 100,
      });
      segmentStartMs = null;
    }
  }

  // Segment encore ouvert à la fin de la fenêtre (le corps est toujours visible à `to`).
  if (segmentStartMs !== null) {
    segments.push({
      startPercent: ((segmentStartMs - from.getTime()) / totalMs) * 100,
      endPercent: 100,
    });
  }

  return segments;
};
