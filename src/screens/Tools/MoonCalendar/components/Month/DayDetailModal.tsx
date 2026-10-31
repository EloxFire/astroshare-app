import { Modal, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { dayDetailModalStyles } from "./DayDetailModal.styles";
import { useAppUnits, type FormatDate } from "../../../../../hooks/useAppUnits";
import { useUpcomingMoonPhases } from "../../../../../hooks/useUpcomingMoonPhases";
import {
  getBodyNextRise,
  getBodyNextSet,
  getLunarAge,
  getLunarDistance,
  getLunarEquatorialCoordinate,
  getLunarIllumination,
  getLunarPhase,
  type GeographicCoordinate,
  type TransitInstance,
} from "@observerly/astrometry";
import { getLunarPhaseLabel } from "../../../../../helpers/astrometry/moon/moonHelpers";
import { formatWithSpaces } from "../../../../../helpers/format";
import { globalStyles } from "../../../../../helpers/globalStyles";
import MoonPhase from "../../../../../components/MoonPhase/MoonPhase";

type DayDetailModalProps = {
  date: Date;
  observer: GeographicCoordinate | undefined;
  onClose: () => void;
};

// Réutilise les mêmes clés de traduction que TonightView (transit.notApplicable/neverSets),
// mais sans le suffixe hier/demain : ici la date est déjà fixée par la cellule sélectionnée.
const formatTransitTime = (transit: TransitInstance | boolean | undefined, t: TFunction, formatDate: FormatDate): string => {
  if (transit === undefined) return t("transit.loading");
  if (transit === false) return t("transit.notApplicable");
  if (transit === true) return t("transit.neverSets");
  return formatDate(transit.datetime).format("HH:mm");
};

const DayDetailModal = ({ date, observer, onClose }: DayDetailModalProps) => {
  const { t } = useTranslation("moon");
  const { formatDate } = useAppUnits();

  const phase = getLunarPhase(date);
  const { age } = getLunarAge(date);
  const illumination = getLunarIllumination(date);

  const eqCoords = getLunarEquatorialCoordinate(date);
  const rise = observer ? getBodyNextRise(date, observer, eqCoords) : undefined;
  const set = observer ? getBodyNextSet(date, observer, eqCoords) : undefined;

  // Prochaine phase principale à partir de cette date (pas depuis aujourd'hui) — la première
  // des 4 renvoyées par useUpcomingMoonPhases, déjà triées chronologiquement.
  const [nextPhase] = useUpcomingMoonPhases(date);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={dayDetailModalStyles.backdrop} onPress={onClose}>
        <Pressable style={dayDetailModalStyles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={dayDetailModalStyles.header}>
            <MoonPhase date={date} size={72} observer={observer} skyOrientationTime="meridian" />
            <View style={dayDetailModalStyles.header.infos}>
              <Text style={dayDetailModalStyles.header.infos.date}>{formatDate(date).format("dddd DD MMMM")}</Text>
              <Text style={dayDetailModalStyles.header.infos.phase}>{getLunarPhaseLabel(phase)}</Text>
              <Text style={dayDetailModalStyles.header.infos.subtitle}>
                {illumination.toFixed(1)}% · {t("stats.ageValue", { value: age.toFixed(0) })}
              </Text>
            </View>
          </View>

          <View style={globalStyles.content.heroCard}>
            <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
              <Text style={globalStyles.content.heroCard.item.title}>{t("detail.riseSet")}</Text>
              <Text style={globalStyles.content.heroCard.item.value}>
                {t("detail.riseSetValue", {
                  rise: formatTransitTime(rise, t, formatDate),
                  set: formatTransitTime(set, t, formatDate),
                })}
              </Text>
            </View>

            <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
              <Text style={globalStyles.content.heroCard.item.title}>{t("ephemeris.distance")}</Text>
              <Text style={globalStyles.content.heroCard.item.value}>
                {t("ephemeris.distanceValue", { value: formatWithSpaces(Math.round(getLunarDistance(date) / 1000)) })}
              </Text>
            </View>

            <View style={globalStyles.content.heroCard.item}>
              <Text style={globalStyles.content.heroCard.item.title}>{t("detail.nextPhase")}</Text>
              <Text style={globalStyles.content.heroCard.item.value}>
                {t("detail.nextPhaseValue", { phase: t(`phases.${nextPhase.phase}`), date: formatDate(nextPhase.date).format("D MMM") })}
              </Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DayDetailModal;
