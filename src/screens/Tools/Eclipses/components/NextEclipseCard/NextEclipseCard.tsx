import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { captitalizeFirstLetter } from "../../../../../helpers/format";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { getLunarEclipseTypeLabelKey, getLunarEclipseVariant, getSolarEclipseTypeLabelKey, getSolarEclipseVariant } from "../../../../../helpers/eclipses/eclipseLabels";
import type { NextEclipse } from "../../../../../hooks/useNextEclipse";
import type { LunarEclipse, SolarEclipse } from "../../../../../types/eclipses/Eclipse";
import EclipseTypeIcon from "../EclipseTypeIcon/EclipseTypeIcon";
import { nextEclipseCardStyles } from "./NextEclipseCard.styles";

interface NextEclipseCardProps {
  nextEclipse: NextEclipse;
  onPress: () => void;
}

const NextEclipseCard = ({ nextEclipse, onPress }: NextEclipseCardProps) => {
  const { t } = useTranslation("tools/eclipses");
  const { formatDate } = useAppUnits();
  const { kind, eclipse } = nextEclipse;

  const variant = kind === "solar" ? getSolarEclipseVariant((eclipse as SolarEclipse).type) : getLunarEclipseVariant((eclipse as LunarEclipse).type);
  const typeLabelKey = kind === "solar" ? getSolarEclipseTypeLabelKey((eclipse as SolarEclipse).type) : getLunarEclipseTypeLabelKey((eclipse as LunarEclipse).type);
  const date = new Date(`${eclipse.calendarDate}T12:00:00Z`);
  const daysUntil = Math.max(0, dayjs(date).startOf("day").diff(dayjs().startOf("day"), "day"));

  return (
    <TouchableOpacity style={nextEclipseCardStyles.card} onPress={onPress}>
      <Text style={nextEclipseCardStyles.card.eyebrow}>{t("screen.nextEclipse.eyebrow")}</Text>

      <View style={nextEclipseCardStyles.card.topRow}>
        <EclipseTypeIcon kind={kind} variant={variant} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={nextEclipseCardStyles.card.title}>{t(typeLabelKey)}</Text>
          <Text style={nextEclipseCardStyles.card.subtitle}>{captitalizeFirstLetter(formatDate(date).format("dddd DD MMMM YYYY"))}</Text>
        </View>
      </View>

      <View style={nextEclipseCardStyles.card.countdown}>
        <Text style={nextEclipseCardStyles.card.countdown.text}>
          {daysUntil === 0 ? t("screen.nextEclipse.today") : t("screen.nextEclipse.countdown", { count: daysUntil })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NextEclipseCard;
