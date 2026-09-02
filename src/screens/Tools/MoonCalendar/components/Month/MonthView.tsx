import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { monthViewStyles } from "./MonthView.styles";
import DayCell from "./DayCell";
import DayDetailModal from "./DayDetailModal";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { useObservatory } from "../../../../../hooks/useObservatory";
import { useMonthlyMoonPhases } from "../../../../../hooks/useMonthlyMoonPhases";
import type { PrincipalMoonPhase } from "../../../../../hooks/useUpcomingMoonPhases";
import { getLunarIllumination, type Observer } from "../../../../../helpers/astrometry/moon";
import { getMoonIllustrationsForMonth } from "../../../../../helpers/api/moon";
import { app_colors } from "../../../../../helpers/variables";

const MIN_MONTH = new Date(2011, 0, 1);

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, count: number): Date => new Date(date.getFullYear(), date.getMonth() + count, 1);

// Clé stable pour indexer les Map par jour calendaire, indépendante du réglage UTC/local de
// l'utilisateur (contrairement à formatDate) : la grille du mois raisonne en jours civils, pas
// en instants.
const dateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Grille en semaines complètes (lundi → dimanche), complétée par les jours des mois
// voisins nécessaires pour ne jamais avoir de semaine tronquée.
const buildMonthGrid = (monthStart: Date): Date[] => {
  const firstWeekday = (monthStart.getDay() + 6) % 7; // 0 = lundi
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - firstWeekday;
    return new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 + dayOffset);
  });
};

// Couleurs de badge par phase principale — voir helpers/variables.ts pour les tokens.
const PHASE_COLORS: Record<PrincipalMoonPhase, { background: string; text: string }> = {
  New: { background: app_colors.primary.main, text: app_colors.accent.light },
  "First Quarter": { background: app_colors.accent.light, text: app_colors.primary.main },
  Full: { background: app_colors.yellow.light, text: app_colors.primary.main },
  "Last Quarter": { background: app_colors.accent.main, text: app_colors.white },
};

const MonthView = () => {
  const { t } = useTranslation("moon");
  const { formatDate } = useAppUnits();
  const { position } = useObservatory();

  const today = useMemo(() => new Date(), []);
  const maxMonth = useMemo(() => new Date(today.getFullYear(), 11, 1), [today]);
  const todayKey = useMemo(() => dateKey(today), [today]);

  const [monthStart, setMonthStart] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthEnd = useMemo(() => new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0), [monthStart]);

  const monthlyPhases = useMonthlyMoonPhases(monthStart, monthEnd);
  const phaseByDate = useMemo(() => {
    const map = new Map<string, PrincipalMoonPhase>();
    monthlyPhases.forEach((entry) => map.set(dateKey(entry.date), entry.phase));
    return map;
  }, [monthlyPhases]);

  // Une seule requête pour les illustrations des ~30 jours du mois affiché, voir
  // getMoonIllustrationsForMonth. staleTime: Infinity, comme pour l'illustration du jour dans
  // TonightView — l'illustration d'une date donnée ne change jamais une fois publiée.
  const { data: illustrations } = useQuery({
    queryKey: ["moonIllustrationsMonth", monthStart.getFullYear(), monthStart.getMonth() + 1],
    queryFn: () => getMoonIllustrationsForMonth(monthStart.getMonth() + 1, monthStart.getFullYear()),
    staleTime: Infinity,
  });

  const illustrationByDate = useMemo(() => {
    const map = new Map<string, string>();
    illustrations?.forEach((illustration) => map.set(illustration.date, illustration.url));
    return map;
  }, [illustrations]);

  // Toutes les valeurs par cellule (phase, badge, couleurs) calculées une seule fois par mois
  // affiché — pas à chaque rendu. Avant cette mémoïsation, ouvrir/fermer la modale de détail
  // (setSelectedDate) redéclenchait ~30 appels à getLunarIllumination à chaque tap.
  const cells = useMemo(() => {
    return buildMonthGrid(monthStart).map((date) => {
      const inCurrentMonth = date.getMonth() === monthStart.getMonth();
      const key = dateKey(date);
      const phase = inCurrentMonth ? phaseByDate.get(key) : undefined;
      const phaseColors = phase ? PHASE_COLORS[phase] : undefined;
      const label = inCurrentMonth ? (phase ? t(`month.phaseAbbreviations.${phase}`) : `${getLunarIllumination(date).toFixed(0)}%`) : "";

      return {
        key,
        date,
        dayNumber: date.getDate(),
        label,
        backgroundColor: phaseColors?.background,
        textColor: phaseColors?.text,
        isToday: inCurrentMonth && key === todayKey,
        inCurrentMonth,
        imageUrl: inCurrentMonth ? illustrationByDate.get(key) : undefined,
      };
    });
  }, [monthStart, phaseByDate, illustrationByDate, todayKey, t]);

  const weeks = useMemo(() => {
    return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  }, [cells]);

  const weekdayLabels = t("month.weekdays", { returnObjects: true }) as string[];

  const canGoPrevious = monthStart.getTime() > MIN_MONTH.getTime();
  const canGoNext = monthStart.getTime() < maxMonth.getTime();

  const handleSelectDate = useCallback((date: Date) => setSelectedDate(date), []);

  const selectedObserver: Observer | undefined = selectedDate && position ? { ...position, datetime: selectedDate } : undefined;

  return (
    <View style={monthViewStyles.container}>
      <View style={monthViewStyles.header}>
        <Pressable
          disabled={!canGoPrevious}
          onPress={() => setMonthStart((current) => addMonths(current, -1))}
          style={monthViewStyles.header.arrow}
        >
          <Text style={[monthViewStyles.header.arrowLabel, !canGoPrevious && monthViewStyles.header.arrowLabelDisabled]}>‹</Text>
        </Pressable>
        <Text style={monthViewStyles.header.title}>{formatDate(monthStart).format("MMMM YYYY")}</Text>
        <Pressable
          disabled={!canGoNext}
          onPress={() => setMonthStart((current) => addMonths(current, 1))}
          style={monthViewStyles.header.arrow}
        >
          <Text style={[monthViewStyles.header.arrowLabel, !canGoNext && monthViewStyles.header.arrowLabelDisabled]}>›</Text>
        </Pressable>
      </View>

      <View style={monthViewStyles.weekdaysRow}>
        {weekdayLabels.map((label, index) => (
          <Text key={index} style={monthViewStyles.weekdaysRow.label}>
            {label}
          </Text>
        ))}
      </View>

      <View style={monthViewStyles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={monthViewStyles.weekRow}>
            {week.map(({ key, ...cell }) => (
              <DayCell key={key} {...cell} onPress={handleSelectDate} />
            ))}
          </View>
        ))}
      </View>

      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          observer={selectedObserver}
          illustrationUrl={illustrationByDate.get(dateKey(selectedDate))}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </View>
  );
};

export default MonthView;
