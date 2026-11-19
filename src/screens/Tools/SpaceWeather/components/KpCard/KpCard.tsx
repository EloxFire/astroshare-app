import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { Minus, TrendingDown, TrendingUp } from "lucide-react-native";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";
import Badge from "../../../../../components/Badges/Badge/Badge";
import KpIndexChart from "../../../../../components/charts/KpIndexChart/KpIndexChart";
import { getKpIndex } from "../../../../../helpers/api/spaceWeather/kpIndex";
import type { KpData } from "../../../../../types/spaceWeather/KpIndex";
import { getNoaaScales } from "../../../../../helpers/api/spaceWeather/scales";
import type { NoaaScalesData } from "../../../../../types/spaceWeather/NoaaScales";
import { kpCardStyles } from "./KpCard.styles";

/**
 * Indice Kp courant + graphique (observé/maintenant/prévision). Le badge d'en-tête reprend
 * l'échelle NOAA géomagnétique (/solarweather/scales), pas kpIndex.current.scale : comportement
 * repris tel quel du SpaceWeatherScreen d'origine. Ça duplique l'appel /scales avec NoaaScalesCard
 * (léger, et chaque carte de cet écran reste autonome — voir le découpage de SpaceWeatherScreen).
 */
const KpCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const [kpIndex, setKpIndex] = useState<KpData | null>(null);
  const [noaaScales, setNoaaScales] = useState<NoaaScalesData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [kp, scales] = await Promise.all([
          getKpIndex(),
          getNoaaScales(),
        ]);
        setKpIndex(kp);
        setNoaaScales(scales);
      })();
    }, [])
  );

  return (
    // TODO : Créer les cartes locker et l'écran locker Astroshare PRO — référencé depuis
    // LockedFeatureCard (généralisé à partir de ce TODO) et le même choix dans LightPollutionMapScreen.
    <View style={[globalStyles.defaultCard, kpCardStyles.card]}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={[globalStyles.categoryTitle, { color: app_colors.white }]}>{t("kpIndex.title")}</Text>
        <Badge
          text={noaaScales ? `${noaaScales.current.geomagnetic.scale} - ${t(`scales.severity.${noaaScales.current.geomagnetic.label}`)}` : '--'}
          backgroundColor={app_colors.yellow.main}
          foregroundColor={app_colors.primary.main}
        />
      </View>

      <View style={kpCardStyles.valueRow}>
        <Text style={kpCardStyles.valueRow.value}>{kpIndex?.current.kp}</Text>
        <Text style={kpCardStyles.valueRow.unit}>/ 9</Text>
        {
          kpIndex?.current && (
            <View style={kpCardStyles.valueRow.trend}>
              {
                kpIndex.current.trend === "rising" ? (
                  <TrendingUp color={app_colors.yellow.main} size={14} />
                ) : kpIndex.current.trend === "falling" ? (
                  <TrendingDown color={app_colors.yellow.main} size={14} />
                ) : (
                  <Minus color={app_colors.yellow.main} size={14} />
                )
              }
              <Text style={kpCardStyles.valueRow.trend.label}>
                {t(`kpIndex.trend.${kpIndex.current.trend}`)} · {t(`kpIndex.scale.${kpIndex.current.level}`)}
              </Text>
            </View>
          )
        }
      </View>

      <KpIndexChart data={kpIndex} />
    </View>
  );
};

export default KpCard;
