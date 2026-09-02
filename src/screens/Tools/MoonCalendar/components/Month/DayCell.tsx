import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Image } from "expo-image";
import { monthViewStyles } from "./MonthView.styles";

type DayCellProps = {
  date: Date;
  dayNumber: number;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  isToday: boolean;
  inCurrentMonth: boolean;
  imageUrl?: string;
  onPress: (date: Date) => void;
};

// Mémoïsé : dans une grille de ~35-42 cellules, on ne veut pas que l'ouverture de la modale de
// détail (setSelectedDate dans MonthView) redéclenche le rendu de toutes les cellules — seules
// leurs props propres (calculées une fois par mois dans MonthView, voir `cells`) les concernent.
const DayCell = ({ date, dayNumber, label, backgroundColor, textColor, isToday, inCurrentMonth, imageUrl, onPress }: DayCellProps) => {
  return (
    <Pressable
      disabled={!inCurrentMonth}
      onPress={() => onPress(date)}
      style={[
        monthViewStyles.dayCell,
        backgroundColor ? { backgroundColor } : null,
        isToday && monthViewStyles.dayCellToday,
        !inCurrentMonth && monthViewStyles.dayCellOutside,
      ]}
    >
      {inCurrentMonth && <Image source={{ uri: imageUrl }} style={monthViewStyles.dayCell.image} cachePolicy="memory-disk" />}
      <Text style={[monthViewStyles.dayCell.dayNumber, textColor ? { color: textColor } : null]}>{dayNumber}</Text>
      {inCurrentMonth && <Text style={[monthViewStyles.dayCell.badge, textColor ? { color: textColor } : null]}>{label}</Text>}
    </Pressable>
  );
};

export default memo(DayCell);
