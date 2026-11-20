import { Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react-native";
import { app_colors } from "../../../../../../helpers/variables";
import { checklistItemRowStyles } from "./ChecklistItemRow.styles";

interface ChecklistItemRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

/**
 * Ligne d'un élément de checklist : toute la ligne coche/décoche (même principe que CheckboxCard),
 * avec un bouton de suppression imbriqué (même pattern que ObjectCardLite — React Native capte le
 * toucher sur le bouton le plus interne, pas besoin de stopPropagation). Indicateur rond (pas la
 * `Checkbox` partagée, carrée) pour matcher la maquette ; barré au lieu de simplement grisé une
 * fois coché (aucun précédent `line-through` ailleurs dans l'app, nouveau style local).
 */
const ChecklistItemRow = ({ label, checked, onToggle, onRemove }: ChecklistItemRowProps) => {
  const { t } = useTranslation("tools/checklists/itemRow");
  return (
    <TouchableOpacity
      style={checklistItemRowStyles.row}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <TouchableOpacity
        style={[checklistItemRowStyles.row.indicator, checked && checklistItemRowStyles.row.indicator.checked]}
        onPress={onToggle}
        hitSlop={8}
      >
        {checked && <Check size={14} color={app_colors.white} strokeWidth={3} />}
      </TouchableOpacity>

      <Text style={[checklistItemRowStyles.row.label, checked && checklistItemRowStyles.row.label.checked]} numberOfLines={2}>
        {label}
      </Text>

      <TouchableOpacity
        style={checklistItemRowStyles.row.remove}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={t("removeAccessibilityLabel")}
        hitSlop={8}
      >
        <X size={18} color={app_colors.grey} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ChecklistItemRow;
