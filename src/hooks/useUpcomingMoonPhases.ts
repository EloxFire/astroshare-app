import { getNextNewMoon } from "@observerly/astrometry";
import { getNextFirstMoonQuarter, getNextFullMoon, getNextLastMoonQuarter } from "../helpers/astrometry/moon/moonHelpers";

export type PrincipalMoonPhase = "New" | "First Quarter" | "Full" | "Last Quarter";

export interface UpcomingMoonPhase {
  phase: PrincipalMoonPhase;
  date: Date;
}

const PHASE_FINDERS: Record<PrincipalMoonPhase, (date: Date) => Date> = {
  New: getNextNewMoon,
  "First Quarter": getNextFirstMoonQuarter,
  Full: getNextFullMoon,
  "Last Quarter": getNextLastMoonQuarter,
};

// Les 4 prochaines occurrences des phases principales à partir de `fromDate`, triées
// chronologiquement — chaque phase est recherchée indépendamment (pas une seule boucle sur le
// cycle), donc l'ordre n'est pas garanti par les finders eux-mêmes.
export const useUpcomingMoonPhases = (fromDate: Date): UpcomingMoonPhase[] => {
  return (Object.keys(PHASE_FINDERS) as PrincipalMoonPhase[])
    .map((phase) => ({ phase, date: PHASE_FINDERS[phase](fromDate) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
