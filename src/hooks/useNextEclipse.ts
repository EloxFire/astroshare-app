import { useEffect, useState } from "react";
import { getLunarEclipses, getSolarEclipses } from "../helpers/api/eclipses/eclipses";
import type { LunarEclipse, SolarEclipse } from "../types/eclipses/Eclipse";

export type NextEclipse = {
  kind: "solar" | "lunar";
  eclipse: SolarEclipse | LunarEclipse;
  date: Date;
};

// Les dates de l'API sont des horaires UTC sans suffixe "Z" : il faut l'ajouter pour que `Date` les
// interprète comme un instant UTC réel plutôt que comme une heure locale (sinon décalage de
// plusieurs heures selon le fuseau de l'appareil).
const getEventDate = (eclipse: SolarEclipse | LunarEclipse): Date =>
  new Date(eclipse.events.greatest?.date ? `${eclipse.events.greatest.date}Z` : `${eclipse.calendarDate}T12:00:00Z`);

const findNextInYear = async <T extends SolarEclipse | LunarEclipse>(
  fetchYear: (year: number) => Promise<T[] | null>,
  year: number,
  now: Date
): Promise<T | null> => {
  const data = (await fetchYear(year)) ?? [];
  const upcoming = data
    .filter((eclipse) => getEventDate(eclipse).getTime() >= now.getTime())
    .sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());
  return upcoming[0] ?? null;
};

// Repli sur l'année suivante si plus aucune éclipse de ce type ne reste dans l'année en cours (ex :
// on est fin décembre et la prochaine éclipse solaire est en janvier prochain).
const findNextOfKind = async <T extends SolarEclipse | LunarEclipse>(
  fetchYear: (year: number) => Promise<T[] | null>,
  now: Date
): Promise<T | null> => {
  const currentYear = now.getFullYear();
  const thisYear = await findNextInYear(fetchYear, currentYear, now);
  return thisYear ?? findNextInYear(fetchYear, currentYear + 1, now);
};

// Cherche la prochaine éclipse à venir, solaire ou lunaire, en comparant leurs deux prochaines
// occurrences respectives et en gardant la plus proche dans le temps — utilisé pour la carte « à ne
// pas manquer » de l'écran liste.
export const useNextEclipse = () => {
  const [nextEclipse, setNextEclipse] = useState<NextEclipse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const now = new Date();
      const [nextSolar, nextLunar] = await Promise.all([
        findNextOfKind(getSolarEclipses, now),
        findNextOfKind(getLunarEclipses, now),
      ]);
      if (cancelled) return;

      const rawCandidates: { kind: "solar" | "lunar"; eclipse: SolarEclipse | LunarEclipse }[] = [];
      if (nextSolar) rawCandidates.push({ kind: "solar", eclipse: nextSolar });
      if (nextLunar) rawCandidates.push({ kind: "lunar", eclipse: nextLunar });

      const candidates = rawCandidates
        .map((candidate) => ({ ...candidate, date: getEventDate(candidate.eclipse) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setIsLoading(false);
      setNextEclipse(candidates[0] ?? null);
    })();

    return () => { cancelled = true; };
  }, []);

  return { nextEclipse, isLoading };
};
