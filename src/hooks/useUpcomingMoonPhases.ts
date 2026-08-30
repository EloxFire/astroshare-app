import { useMemo } from "react";
import { getNextNewMoon, getNextFirstQuarter, getNextFullMoon, getNextLastQuarter } from "../helpers/astrometry/moon";

export type PrincipalMoonPhase = "New" | "First Quarter" | "Full" | "Last Quarter";

export type UpcomingMoonPhase = {
  phase: PrincipalMoonPhase;
  date: Date;
};

// Les 4 phases "principales" (Nouvelle, Premier Quartier, Pleine, Dernier Quartier) à venir,
// triées par date. Un mois synodique contient exactement une occurrence de chacune : calculer
// "la prochaine X" pour chacune des 4 indépendamment, puis trier par date, donne directement
// la bonne séquence chronologique — peu importe à quel point du cycle on se trouve aujourd'hui.
export const useUpcomingMoonPhases = (fromDate: Date): UpcomingMoonPhase[] => {
  return useMemo(() => {
    const events: UpcomingMoonPhase[] = [
      { phase: "New", date: getNextNewMoon(fromDate) },
      { phase: "First Quarter", date: getNextFirstQuarter(fromDate) },
      { phase: "Full", date: getNextFullMoon(fromDate) },
      { phase: "Last Quarter", date: getNextLastQuarter(fromDate) },
    ];
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [fromDate]);
};
