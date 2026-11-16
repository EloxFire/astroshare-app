import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { launchesCalendarViewStyles } from "./LaunchesCalendarView.styles";

type LaunchCalendarDayCellProps = {
  date: Date;
  dayNumber: number;
  dotColors: string[];
  isToday: boolean;
  isSelected: boolean;
  inCurrentMonth: boolean;
  onPress: (date: Date) => void;
};

// Même principe que DayCell du calendrier lunaire (mémoïsé, grille de ~35-42 cellules) : un point
// par lancement du jour (couleur = statut) à la place du badge phase/%.
const LaunchCalendarDayCell = ({ date, dayNumber, dotColors, isToday, isSelected, inCurrentMonth, onPress }: LaunchCalendarDayCellProps) => {
  return (
    <Pressable
      disabled={!inCurrentMonth}
      onPress={() => onPress(date)}
      style={[
        launchesCalendarViewStyles.dayCell,
        isToday && launchesCalendarViewStyles.dayCellToday,
        isSelected && launchesCalendarViewStyles.dayCellSelected,
        !inCurrentMonth && launchesCalendarViewStyles.dayCellOutside,
      ]}
    >
      <Text style={[launchesCalendarViewStyles.dayCell.dayNumber, isSelected && launchesCalendarViewStyles.dayCellSelectedText]}>
        {dayNumber}
      </Text>
      {inCurrentMonth && dotColors.length > 0 && (
        <View style={launchesCalendarViewStyles.dayCell.dots}>
          {dotColors.slice(0, 3).map((color, index) => (
            <View key={index} style={[launchesCalendarViewStyles.dayCell.dots.dot, { backgroundColor: color }]} />
          ))}
        </View>
      )}
    </Pressable>
  );
};

export default memo(LaunchCalendarDayCell);
