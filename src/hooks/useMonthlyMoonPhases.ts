import { useMemo } from "react";
import { getNextNewMoon, getNextFirstQuarter, getNextFullMoon, getNextLastQuarter } from "../helpers/astrometry/moon";
import type { PrincipalMoonPhase } from "./useUpcomingMoonPhases";

const DAY_MS = 24 * 60 * 60 * 1000;

const PHASE_FINDERS: Record<PrincipalMoonPhase, (date: Date) => Date> = {
  New: getNextNewMoon,
  "First Quarter": getNextFirstQuarter,
  Full: getNextFullMoon,
  "Last Quarter": getNextLastQuarter,
};

export type MonthlyMoonPhase = {
  phase: PrincipalMoonPhase;
  date: Date;
};

// Cherche toutes les occurrences d'une phase tombant dans [monthStart, monthEnd]. On repart
// un peu avant monthStart (marge de 2 jours) pour ne pas rater une occurrence qui aurait
// commencé juste avant le mois affiché. Un mois (28-31j) ne peut pas contenir plus de 2
// occurrences d'une même phase (cycle ~29.5j) — la limite de 4 itérations est une marge de
// sécurité, pas une valeur qu'on s'attend à atteindre.
const findOccurrencesInRange = (finder: (date: Date) => Date, monthStart: Date, monthEnd: Date): Date[] => {
  const occurrences: Date[] = [];
  let from = new Date(monthStart.getTime() - 2 * DAY_MS);

  for (let i = 0; i < 4; i++) {
    const next = finder(from);
    if (next.getTime() > monthEnd.getTime()) break;
    if (next.getTime() >= monthStart.getTime()) occurrences.push(next);
    from = new Date(next.getTime() + DAY_MS);
  }

  return occurrences;
};

// Toutes les phases principales (Nouvelle, Premier Quartier, Pleine, Dernier Quartier) qui
// tombent dans le mois affiché — pour mettre en avant les jours correspondants dans la grille.
export const useMonthlyMoonPhases = (monthStart: Date, monthEnd: Date): MonthlyMoonPhase[] => {
  return useMemo(() => {
    const entries = Object.entries(PHASE_FINDERS) as [PrincipalMoonPhase, (date: Date) => Date][];
    return entries
      .flatMap(([phase, finder]) => findOccurrencesInRange(finder, monthStart, monthEnd).map((date) => ({ phase, date })))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [monthStart.getTime(), monthEnd.getTime()]);
};
