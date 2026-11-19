import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import CheckboxCard from "../../../../../components/cards/CheckboxCard/CheckboxCard";
import { app_colors } from "../../../../../helpers/variables";
import { FieldSimulatorCombo } from "../../../../../helpers/fieldSimulator/setupCombos";
import { comboSelectionListStyles } from "./ComboSelectionList.styles";

export type ComboSelectionRow = {
  combo: FieldSimulatorCombo;
  label: string;
  subtitle: string;
  value: string;
};

interface ComboSelectionListProps {
  title: string;
  rows: ComboSelectionRow[];
  selectedComboIds: string[];
  // La limite à 4 setups comparés (ou le côté "sélection unique" du mode "un setup") est gérée par
  // l'appelant : ce composant se contente d'afficher l'état `selectedComboIds` et de relayer les
  // appuis, il ne connaît pas la règle en vigueur.
  onToggle: (comboId: string) => void;
}

/**
 * Liste de sélection "AVEC QUEL SETUP ?" (mode "un setup", sélection unique pilotée par le parent)
 * ou "SETUPS COMPARÉS · 4 MAX" (mode "comparer", sélection multiple) — même rendu de ligne dans les
 * deux cas (CheckboxCard + valeur de champ à droite), le bouton pointillé en bas renvoie vers
 * l'ajout d'un setup (Journal > Matériel) quand aucune des combinaisons existantes ne convient.
 */
const ComboSelectionList = ({ title, rows, selectedComboIds, onToggle }: ComboSelectionListProps) => {
  const { t } = useTranslation("tools/fieldSimulator");

  return (
    <View style={comboSelectionListStyles.container}>
      <View style={comboSelectionListStyles.titleRow}>
        <View style={comboSelectionListStyles.titleRow.line} />
        <Text style={comboSelectionListStyles.titleRow.text}>{title}</Text>
        <View style={comboSelectionListStyles.titleRow.line} />
      </View>

      {
        rows.map(({ combo, label, subtitle, value }) => (
          <CheckboxCard
            key={combo.id}
            title={label}
            subtitle={subtitle}
            checked={selectedComboIds.includes(combo.id)}
            onChange={() => onToggle(combo.id)}
            trailing={<Text style={comboSelectionListStyles.rowValue}>{value}</Text>}
          />
        ))
      }

      <TouchableOpacity style={comboSelectionListStyles.addButton} onPress={() => router.push("/tools/journal/gear/setups/add")}>
        <Plus color={app_colors.accent.main} size={16} />
        <Text style={comboSelectionListStyles.addButton.text}>{t("combos.addAnother")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboSelectionList;
