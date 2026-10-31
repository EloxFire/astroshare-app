import { memo } from "react";
import { Pressable, Text } from "react-native";
import { monthViewStyles } from "./MonthView.styles";

type DayCellProps = {
  date: Date;
  dayNumber: number;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  isToday: boolean;
  inCurrentMonth: boolean;
  onPress: (date: Date) => void;
};

// Mémoïsé : dans une grille de ~35-42 cellules, on ne veut pas que l'ouverture de la modale de
// détail (setSelectedDate dans MonthView) redéclenche le rendu de toutes les cellules — seules
// leurs props propres (calculées une fois par mois dans MonthView, voir `cells`) les concernent.
//
// Pas d'aperçu <MoonPhase> 3D ici : une instance par cellule (jusqu'à ~42 en même temps) ouvrirait
// autant de contextes GL natifs à la fois, bien plus lourd que l'usage prévu (quelques instances
// côte à côte) — réservé à la carte de détail (une seule instance). Le badge phase/% reste le seul
// aperçu dans la grille.
const DayCell = ({ date, dayNumber, label, backgroundColor, textColor, isToday, inCurrentMonth, onPress }: DayCellProps) => {
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
      <Text style={[monthViewStyles.dayCell.dayNumber, textColor ? { color: textColor } : null]}>{dayNumber}</Text>
      {inCurrentMonth && <Text style={[monthViewStyles.dayCell.badge, textColor ? { color: textColor } : null]}>{label}</Text>}
    </Pressable>
  );
};

export default memo(DayCell);
