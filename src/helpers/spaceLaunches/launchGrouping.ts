import { TFunction } from "i18next";
import { FormatDate } from "../../hooks/useAppUnits";
import { Launch } from "../../types/spaceLaunches/Launch";

export type LaunchGroup = {
  key: string;
  label: string;
  launches: Launch[];
}

// Regroupe les lancements par période d'affichage : "cette semaine" (jusqu'au dimanche courant),
// "plus tard ce mois-ci", puis un groupe par mois (libellé "Mois AAAA"). `formatDate` doit venir de
// useAppUnits() pour respecter le fuseau choisi par l'utilisateur (voir son commentaire).
export const groupLaunchesByPeriod = (launches: Launch[], now: Date, formatDate: FormatDate, t: TFunction): LaunchGroup[] => {
  const today = formatDate(now);
  const weekday = (today.day() + 6) % 7; // Lundi = 0 (dayjs.day() renvoie Dimanche = 0)
  const endOfWeek = today.add(6 - weekday, "day").endOf("day");

  const groups: LaunchGroup[] = [];

  for (const launch of launches) {
    const launchDate = formatDate(launch.net);
    let key: string;
    let label: string;

    if (!launchDate.isAfter(endOfWeek)) {
      key = "thisWeek";
      label = t("list.groups.thisWeek");
    } else if (launchDate.isSame(today, "month")) {
      key = "laterThisMonth";
      label = t("list.groups.laterThisMonth", { month: launchDate.format("MMMM") });
    } else {
      key = launchDate.format("YYYY-MM");
      label = launchDate.format("MMMM YYYY");
    }

    let group = groups.find((existingGroup) => existingGroup.key === key);
    if (!group) {
      group = { key, label, launches: [] };
      groups.push(group);
    }
    group.launches.push(launch);
  }

  return groups;
}
