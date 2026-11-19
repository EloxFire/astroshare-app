import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { getNoaaScaleColor } from "../../../../../helpers/variables";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { getSolarWeatherOutlook } from "../../../../../helpers/api/spaceWeather/outlook";
import type { SolarWeatherOutlookData } from "../../../../../types/spaceWeather/SolarWeatherOutlook";
import { outlookCardStyles } from "./OutlookCard.styles";

/**
 * Tendance sur 27 jours (radioFlux/aIndex/Kp par jour) : rangée défilante de pastilles, colorée
 * comme les cartes NOAA (getNoaaScaleColor) pour rester cohérente, d'un calme "G0"/null à un G5 en
 * rouge sombre. Change peu souvent (contrairement à kpIndex.forecast, qui ne couvre que ~3 jours) :
 * simple refresh au focus de l'écran, pas de minuteur.
 */
const OutlookCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const { formatDate } = useAppUnits();
  const [outlook, setOutlook] = useState<SolarWeatherOutlookData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setOutlook(await getSolarWeatherOutlook());
      })();
    }, [])
  );

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("outlook.title")}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={outlookCardStyles.row.content}
      >
        {
          outlook?.data.map((day) => (
            <View
              key={day.date}
              style={[outlookCardStyles.row.item, { borderColor: getNoaaScaleColor(day.scale) }]}
            >
              <Text style={outlookCardStyles.row.item.date}>
                {formatDate(new Date(day.date)).format("DD/MM")}
              </Text>
              <View style={[outlookCardStyles.row.item.dot, { backgroundColor: getNoaaScaleColor(day.scale) }]} />
              <Text style={outlookCardStyles.row.item.kp}>{t("outlook.kp", { value: day.kp })}</Text>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default OutlookCard;
