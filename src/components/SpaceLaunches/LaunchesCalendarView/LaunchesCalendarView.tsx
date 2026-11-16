import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { addMonths, buildMonthWeeks, dateKey, isSameDay, startOfMonth } from "../../../helpers/date/monthGrid";
import { getLaunchStatusColors } from "../../../helpers/spaceLaunches/launchStatus";
import { Launch } from "../../../types/spaceLaunches/Launch";
import LaunchCalendarDayCell from "./LaunchCalendarDayCell";
import LaunchCard from "../LaunchCard/LaunchCard";
import { launchesCalendarViewStyles } from "./LaunchesCalendarView.styles";

const LaunchesCalendarView = ({ launches }: { launches: Launch[] }) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();

  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const today = new Date();
  const weeks = useMemo(() => buildMonthWeeks(monthStart), [monthStart]);

  // Indexés par jour (fuseau utilisateur, via formatDate) pour éviter un .filter() sur toute la
  // liste à chaque cellule de la grille.
  const launchesByDay = useMemo(() => {
    const map = new Map<string, Launch[]>();
    for (const launch of launches) {
      const key = formatDate(launch.net).format("YYYY-MM-DD");
      map.set(key, [...(map.get(key) ?? []), launch]);
    }
    return map;
  }, [launches, formatDate]);

  const getDayLaunches = (date: Date) => launchesByDay.get(formatDate(date).format("YYYY-MM-DD")) ?? [];

  const weekdays = t("calendar.weekdays", { returnObjects: true }) as string[];
  const selectedDayLaunches = getDayLaunches(selectedDate);

  return (
    <View style={launchesCalendarViewStyles.container}>
      <View style={launchesCalendarViewStyles.header}>
        <TouchableOpacity style={launchesCalendarViewStyles.header.arrow} onPress={() => setMonthStart((prev) => addMonths(prev, -1))}>
          <Text style={launchesCalendarViewStyles.header.arrowLabel}>‹</Text>
        </TouchableOpacity>
        <Text style={launchesCalendarViewStyles.header.title}>{formatDate(monthStart).format("MMMM YYYY")}</Text>
        <TouchableOpacity style={launchesCalendarViewStyles.header.arrow} onPress={() => setMonthStart((prev) => addMonths(prev, 1))}>
          <Text style={launchesCalendarViewStyles.header.arrowLabel}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={launchesCalendarViewStyles.weekdaysRow}>
        {weekdays.map((label, index) => (
          <Text key={index} style={launchesCalendarViewStyles.weekdaysRow.label}>{label}</Text>
        ))}
      </View>

      <View style={launchesCalendarViewStyles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={launchesCalendarViewStyles.weekRow}>
            {week.map((cell) => (
              <LaunchCalendarDayCell
                key={dateKey(cell.date)}
                date={cell.date}
                dayNumber={cell.date.getDate()}
                dotColors={getDayLaunches(cell.date).map((launch) => getLaunchStatusColors(launch.status.abbrev).background)}
                isToday={isSameDay(cell.date, today)}
                isSelected={isSameDay(cell.date, selectedDate)}
                inCurrentMonth={cell.inCurrentMonth}
                onPress={setSelectedDate}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={launchesCalendarViewStyles.selectedDay}>
        <Text style={launchesCalendarViewStyles.selectedDay.title}>
          {formatDate(selectedDate).format("D MMMM")} · {t("calendar.selectedDay.count", { count: selectedDayLaunches.length })}
        </Text>
        {selectedDayLaunches.length === 0 ? (
          <Text style={launchesCalendarViewStyles.selectedDay.empty}>{t("calendar.noLaunchThisDay")}</Text>
        ) : (
          selectedDayLaunches.map((launch) => <LaunchCard key={launch.id} launch={launch} />)
        )}
      </View>
    </View>
  );
}

export default LaunchesCalendarView;
