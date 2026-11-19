import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Badge from "../../../../../components/Badges/Badge/Badge";
import { app_colors } from "../../../../../helpers/variables";
import { formatLocaleNumber } from "../../../../../helpers/format";
import { FieldFitResult, FieldOfView } from "../../../../../helpers/fieldSimulator/fieldOfView";
import { ObjectAngularSize } from "../../../../../helpers/fieldSimulator/objectAngularSize";
import { FieldSimulatorCombo, getComboLabel } from "../../../../../helpers/fieldSimulator/setupCombos";
import FieldOfViewPreview from "../FieldOfViewPreview/FieldOfViewPreview";
import { comboResultCardStyles } from "./ComboResultCard.styles";

interface ComboResultCardProps {
  combo: FieldSimulatorCombo;
  objectPrimary: string;
  fieldOfView: FieldOfView;
  angularSize: ObjectAngularSize | null;
  fitResult: FieldFitResult | null;
  size?: number;
  compact?: boolean;
}

/**
 * Bloc résultat réutilisé en grand (mode "un setup") et en petit, répété jusqu'à 4 fois dans la
 * grille du mode "comparer" (prop `compact`) : aperçu du champ à l'échelle (`FieldOfViewPreview`),
 * libellé du setup, taux d'occupation du champ et badge cadré/débordé.
 */
const ComboResultCard = ({ combo, objectPrimary, fieldOfView, angularSize, fitResult, size = 220, compact = false }: ComboResultCardProps) => {
  const { t, i18n } = useTranslation("tools/fieldSimulator");

  const label = getComboLabel(combo, t("combos.unnamedScope"), t("combos.unnamedEyepiece"), t("combos.unnamedCamera"));

  return (
    <View style={comboResultCardStyles.card}>
      <FieldOfViewPreview fieldOfView={fieldOfView} angularSize={angularSize} size={size} />

      <View style={comboResultCardStyles.texts}>
        <Text style={[comboResultCardStyles.texts.label, compact && comboResultCardStyles.compact.label]} numberOfLines={1}>
          {label}
        </Text>
        {
          fitResult && (
            <Text style={[comboResultCardStyles.texts.occupancy, compact && comboResultCardStyles.compact.occupancy]}>
              {t("preview.occupancy", { name: objectPrimary, percent: formatLocaleNumber(fitResult.occupancyPercent, i18n.language, 0) })}
            </Text>
          )
        }
      </View>

      {
        fitResult && (
          fitResult.fits ? (
            <Badge text={t("preview.fits")} backgroundColor={app_colors.green.light} foregroundColor={app_colors.green.main} />
          ) : (
            <Badge text={t("preview.overflows")} backgroundColor={app_colors.red.light} foregroundColor={app_colors.red.main} />
          )
        )
      }
    </View>
  );
};

export default ComboResultCard;
