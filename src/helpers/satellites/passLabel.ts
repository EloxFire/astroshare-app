import type { TFunction } from "i18next";
import type { FormatDate } from "../../hooks/useAppUnits";

// Libellé compact d'un passage à venir ("Aujourd'hui 18:42", "Demain 18:42", "jeu. 20/11 06:12")
// — `t` est injectée (convention de l'app pour une fonction hors composant, voir §3 de
// agents-reference.md), namespace tools/satelliteTracker (clés passDay.today / passDay.tomorrow).
export const formatPassDayLabel = (date: Date, formatDate: FormatDate, t: TFunction, referenceDate: Date = new Date()): string => {
  const dayDiff = formatDate(date).startOf("day").diff(formatDate(referenceDate).startOf("day"), "day");
  const dayLabel = dayDiff === 0 ? t("passDay.today") : dayDiff === 1 ? t("passDay.tomorrow") : formatDate(date).format("ddd DD/MM");
  return `${dayLabel} ${formatDate(date).format("HH:mm")}`;
};
