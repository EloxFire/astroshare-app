import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { app_colors } from "../../../../../helpers/variables";
import { captitalizeFirstLetter, formatLocaleNumber } from "../../../../../helpers/format";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import Badge from "../../../../../components/Badges/Badge/Badge";
import { getLunarEclipseVariant, getLunarEclipseTypeLabelKey, getSolarEclipseTypeLabelKey, getSolarEclipseVariant } from "../../../../../helpers/eclipses/eclipseLabels";
import type { LunarEclipse, SolarEclipse } from "../../../../../types/eclipses/Eclipse";
import EclipseTypeIcon from "../EclipseTypeIcon/EclipseTypeIcon";
import { eclipseRowStyles } from "./EclipseRow.styles";

interface EclipseRowProps {
  kind: "solar" | "lunar";
  eclipse: SolarEclipse | LunarEclipse;
  // undefined : visibilité pas encore connue (en cours de vérification) ; null : vérifiée, non
  // visible depuis le lieu effectif ; objet : vérifiée, visible, avec sa magnitude locale.
  localVisibility?: { magnitude: number } | null;
  onPress: () => void;
}

const EclipseRow = ({ kind, eclipse, localVisibility, onPress }: EclipseRowProps) => {
  const { t, i18n } = useTranslation("tools/eclipses");
  const { formatDate } = useAppUnits();

  const variant = kind === "solar" ? getSolarEclipseVariant((eclipse as SolarEclipse).type) : getLunarEclipseVariant((eclipse as LunarEclipse).type);
  const typeLabelKey = kind === "solar" ? getSolarEclipseTypeLabelKey((eclipse as SolarEclipse).type) : getLunarEclipseTypeLabelKey((eclipse as LunarEclipse).type);
  const date = new Date(`${eclipse.calendarDate}T12:00:00Z`);

  return (
    <TouchableOpacity style={eclipseRowStyles.card} onPress={onPress}>
      <EclipseTypeIcon kind={kind} variant={variant} size={36} />

      <View style={eclipseRowStyles.card.texts}>
        <Text style={eclipseRowStyles.card.texts.date}>{captitalizeFirstLetter(formatDate(date).format("DD MMMM YYYY"))}</Text>
        <Text style={eclipseRowStyles.card.texts.subtitle}>{t(typeLabelKey)}</Text>
      </View>

      <View style={eclipseRowStyles.card.badges}>
        {localVisibility === undefined ? null : localVisibility === null ? (
          <Badge text={t("list.notVisible")} backgroundColor={app_colors.primary.light} foregroundColor={app_colors.primary.medium} />
        ) : (
          <Badge
            text={t("list.visibleHere", { value: formatLocaleNumber(localVisibility.magnitude * 100, i18n.language, 0) })}
            backgroundColor={app_colors.yellow.light}
            foregroundColor={app_colors.primary.main}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EclipseRow;
