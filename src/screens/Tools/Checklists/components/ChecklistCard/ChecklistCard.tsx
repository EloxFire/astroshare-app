import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Check, RotateCcw } from "lucide-react-native";
import CircularGauge from "../../../../../components/charts/CircularGauge/CircularGauge";
import { app_colors, withOpacity } from "../../../../../helpers/variables";
import type { Checklist } from "../../../../../types/checklists/Checklist";
import { checklistCardStyles } from "./ChecklistCard.styles";

interface ChecklistCardProps {
  checklist: Checklist;
  onPress: () => void;
  onReset: () => void;
}

/**
 * Carte compacte (ligne : jauge + textes + reset), pas la grande tuile carrée de la maquette —
 * demandé explicitement moins imposant sur l'écran principal. La jauge affiche "coché/total" tant
 * qu'il reste des éléments à cocher, puis une coche pleine (vert, même convention que
 * FieldSimulator/SpaceWeather pour un état "terminé") une fois la liste complète.
 */
const ChecklistCard = ({ checklist, onPress, onReset }: ChecklistCardProps) => {
  const { t } = useTranslation("tools/checklists/card");

  const total = checklist.items.length;
  const checkedCount = checklist.items.filter((item) => item.checked).length;
  const remaining = total - checkedCount;
  const isComplete = total > 0 && remaining === 0;

  const subtitle = total === 0
    ? t("empty")
    : isComplete
      ? t("ready", { checked: checkedCount, total })
      : t("toCheck", { count: remaining });

  return (
    <TouchableOpacity style={checklistCardStyles.card} onPress={onPress} activeOpacity={0.8}>
      <CircularGauge
        value={isComplete ? 1 : checkedCount}
        max={isComplete ? 1 : (total || 1)}
        size={44}
        strokeWidth={4}
        progressColor={isComplete ? app_colors.green.main : app_colors.accent.main}
        trackColor={withOpacity(isComplete ? app_colors.green.main : app_colors.accent.main, 0.15)}
      >
        {
          isComplete
            ? <Check size={18} color={app_colors.green.main} />
            : <Text style={checklistCardStyles.card.ring.value}>{total === 0 ? "–" : `${checkedCount}/${total}`}</Text>
        }
      </CircularGauge>

      <View style={checklistCardStyles.card.texts}>
        <Text style={checklistCardStyles.card.texts.name} numberOfLines={1}>{checklist.name}</Text>
        {/* {checklist.description && <Text style={checklistCardStyles.card.texts.description} numberOfLines={1}>{checklist.description}</Text>} */}
        <Text style={checklistCardStyles.card.texts.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      {/* {
        checkedCount > 0 && (
          <TouchableOpacity
            style={checklistCardStyles.card.resetButton}
            onPress={onReset}
            accessibilityRole="button"
            accessibilityLabel={t("uncheckAllAccessibilityLabel")}
            hitSlop={8}
          >
            <RotateCcw size={14} color={app_colors.accent.main} />
          </TouchableOpacity>
        )
      } */}
    </TouchableOpacity>
  );
};

export default ChecklistCard;
