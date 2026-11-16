import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getLunarIllumination, getLunarPhase, type Phase } from "@observerly/astrometry";
import { useLocation } from "../../../../../context/LocationContext";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { app_colors } from "../../../../../helpers/variables";
import DayCell from "./DayCell";
import DayDetailModal from "./DayDetailModal";
import MonthlyIlluminationChart from "./MonthlyIlluminationChart";
import { monthViewStyles } from "./MonthView.styles";
import { buildMonthGrid, dateKey, isSameDay, startOfMonth, addMonths } from "../../../../../helpers/date/monthGrid";

// Couleurs de badge pour les 4 phases principales uniquement — les autres jours (croissant/
// gibbeuse) gardent le fond blanc par défaut de DayCell, avec le % d'illumination en repli (voir
// `label` dans `cells` ci-dessous).
const PHASE_COLORS: Partial<Record<Phase, { background: string; text: string }>> = {
  New: { background: app_colors.primary.main, text: app_colors.white },
  "First Quarter": { background: app_colors.accent.light, text: app_colors.primary.main },
  Full: { background: app_colors.yellow.light, text: app_colors.primary.main },
  "Last Quarter": { background: app_colors.accent.light, text: app_colors.primary.main },
};

const MonthView = () => {
  const { t } = useTranslation("moon");
  const { formatDate } = useAppUnits();
  const { location } = useLocation();

  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const observer = useMemo(
    () =>
      location
        ? { latitude: location.latitude, longitude: location.longitude, altitude: location.elevation ?? 0 }
        : undefined,
    [location]
  );

  const today = new Date();

  const cells = useMemo(
    () =>
      buildMonthGrid(monthStart).map(({ date, inCurrentMonth }) => {
        if (!inCurrentMonth) return { date, inCurrentMonth, label: "", backgroundColor: undefined, textColor: undefined };

        const phase = getLunarPhase(date);
        const illumination = getLunarIllumination(date);
        const phaseColors = PHASE_COLORS[phase];
        const principalAbbreviation = t(`month.phaseAbbreviations.${phase}`, { defaultValue: "" });

        return {
          date,
          inCurrentMonth,
          label: principalAbbreviation || `${Math.round(illumination)}%`,
          backgroundColor: phaseColors?.background,
          textColor: phaseColors?.text,
        };
      }),
    [monthStart, t]
  );

  const weeks = useMemo(() => {
    const rows: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [cells]);

  const weekdays = t("month.weekdays", { returnObjects: true }) as string[];

  return (
    <View style={monthViewStyles.container}>
      <View style={monthViewStyles.header}>
        <TouchableOpacity style={monthViewStyles.header.arrow} onPress={() => setMonthStart((prev) => addMonths(prev, -1))}>
          <Text style={monthViewStyles.header.arrowLabel}>‹</Text>
        </TouchableOpacity>
        <Text style={monthViewStyles.header.title}>{formatDate(monthStart).format("MMMM YYYY")}</Text>
        <TouchableOpacity style={monthViewStyles.header.arrow} onPress={() => setMonthStart((prev) => addMonths(prev, 1))}>
          <Text style={monthViewStyles.header.arrowLabel}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={monthViewStyles.weekdaysRow}>
        {weekdays.map((label, index) => (
          <Text key={index} style={monthViewStyles.weekdaysRow.label}>
            {label}
          </Text>
        ))}
      </View>

      <View style={monthViewStyles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={monthViewStyles.weekRow}>
            {week.map((cell) => (
              <DayCell
                key={dateKey(cell.date)}
                date={cell.date}
                dayNumber={cell.date.getDate()}
                label={cell.label}
                backgroundColor={cell.backgroundColor}
                textColor={cell.textColor}
                isToday={isSameDay(cell.date, today)}
                inCurrentMonth={cell.inCurrentMonth}
                onPress={setSelectedDate}
              />
            ))}
          </View>
        ))}
      </View>

      <MonthlyIlluminationChart monthStart={monthStart} />

      {selectedDate && (
        <DayDetailModal date={selectedDate} observer={observer} onClose={() => setSelectedDate(null)} />
      )}
    </View>
  );
};

export default MonthView;
