import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Circle, Square, X } from "lucide-react-native";
import { useUserDataStore } from "../../../store/userData.store";
import { getComboFieldOfView } from "../../../helpers/fieldSimulator/fieldOfView";
import { getComboLabel, getFieldSimulatorCombos, type FieldSimulatorCombo } from "../../../helpers/fieldSimulator/setupCombos";
import { formatLocaleNumber } from "../../../helpers/format";
import { DARK_GLASS_ICON } from "../../../helpers/planetarium/utils/darkGlass";
import { fieldSimulatorPickerStyles as styles } from "./FieldSimulatorPicker.styles";

interface FieldSimulatorPickerProps {
  visible: boolean;
  selectedComboId: string | null;
  onSelect: (combo: FieldSimulatorCombo) => void;
  onClear: () => void;
  onClose: () => void;
  top: number;
}

const formatComboValue = (combo: FieldSimulatorCombo, language: string): string | null => {
  const fieldOfView = getComboFieldOfView(combo);
  if (!fieldOfView) return null;
  if (fieldOfView.shape === "circle") return `⌀ ${formatLocaleNumber(fieldOfView.diameterDegrees, language, 2)}°`;
  return `${formatLocaleNumber(fieldOfView.widthDegrees, language, 2)}° × ${formatLocaleNumber(fieldOfView.heightDegrees, language, 2)}°`;
};

/**
 * Sélecteur de matériel pour le cadre de champ (FieldOfViewOverlay) — réutilise les combinaisons
 * instrument+oculaire/caméra déjà calculées par l'outil Simulateur de champ (mêmes types/formules,
 * voir setupCombos.ts/fieldOfView.ts), pas de nouvelle logique de calcul de champ ici.
 */
const FieldSimulatorPicker = ({ visible, selectedComboId, onSelect, onClear, onClose, top }: FieldSimulatorPickerProps) => {
  const { t, i18n } = useTranslation("explore");
  const setups = useUserDataStore((state) => state.gear.setups);
  const combos = getFieldSimulatorCombos(setups);

  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.card, { top }]}>
        {combos.length === 0 ? (
          <Text style={styles.emptyText}>{t("fieldSimulator.empty")}</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedComboId && (
              <TouchableOpacity style={styles.row} onPress={onClear}>
                <View style={styles.row.iconBloc}>
                  <X size={14} color={DARK_GLASS_ICON} />
                </View>
                <View style={styles.row.texts}>
                  <Text style={styles.row.texts.label}>{t("fieldSimulator.clear")}</Text>
                </View>
              </TouchableOpacity>
            )}

            {combos.map((combo) => {
              const label = getComboLabel(
                combo,
                t("tools/fieldSimulator:combos.unnamedScope"),
                t("tools/fieldSimulator:combos.unnamedEyepiece"),
                t("tools/fieldSimulator:combos.unnamedCamera")
              );
              const value = formatComboValue(combo, i18n.language);
              const Icon = combo.kind === "eyepiece" ? Circle : Square;

              return (
                <TouchableOpacity key={combo.id} style={styles.row} onPress={() => onSelect(combo)}>
                  <View style={styles.row.iconBloc}>
                    <Icon size={14} color={DARK_GLASS_ICON} />
                  </View>
                  <View style={styles.row.texts}>
                    <Text style={styles.row.texts.label} numberOfLines={1}>{label}</Text>
                    {value && <Text style={styles.row.texts.value}>{value}</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default FieldSimulatorPicker;
