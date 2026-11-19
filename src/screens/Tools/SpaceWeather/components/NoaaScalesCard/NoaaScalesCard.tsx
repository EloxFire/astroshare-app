import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { getNoaaScaleColor } from "../../../../../helpers/variables";
import { getNoaaScales } from "../../../../../helpers/api/spaceWeather/scales";
import type { NoaaScalesData } from "../../../../../types/spaceWeather/NoaaScales";
import NoaaScaleCard from "../../../../../components/cards/NoaaScaleCard/NoaaScaleCard";
import { noaaScalesCardStyles } from "./NoaaScalesCard.styles";

/**
 * Les 3 échelles NOAA (géomagnétique/pannes radio/radiation solaire) du jour. Refait son propre
 * appel à /solarweather/scales plutôt que de le recevoir en prop : KpCard en a aussi besoin (pour
 * son badge), et duplique donc cet appel léger plutôt que de le faire remonter au parent — chaque
 * carte de cet écran reste autonome (voir le découpage de SpaceWeatherScreen).
 */
const NoaaScalesCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const [noaaScales, setNoaaScales] = useState<NoaaScalesData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setNoaaScales(await getNoaaScales());
      })();
    }, [])
  );

  return (
    <View style={noaaScalesCardStyles.container}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("scales.title")}</Text>
        {/* TODO : Implémenter l'écran "voir tout" */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={noaaScalesCardStyles.link}>{t("scales.all")}</Text>
        </TouchableOpacity>
      </View>

      <View style={noaaScalesCardStyles.scales}>
        <NoaaScaleCard
          value={noaaScales?.current.geomagnetic.scale ?? "--"}
          title={noaaScales ? t(`scales.severity.${noaaScales.current.geomagnetic.label}`) : "--"}
          subtitle={t("scales.geomagnetic.title")}
          containerStyle={{ backgroundColor: getNoaaScaleColor(noaaScales?.current.geomagnetic.scale) }}
        />

        <NoaaScaleCard
          value={noaaScales?.current.radioBlackout.scale ?? "--"}
          title={noaaScales ? t(`scales.severity.${noaaScales.current.radioBlackout.label}`) : "--"}
          subtitle={t("scales.radioBlackout.title")}
          containerStyle={{ backgroundColor: getNoaaScaleColor(noaaScales?.current.radioBlackout.scale) }}
        />

        <NoaaScaleCard
          value={noaaScales?.current.solarRadiation.scale ?? "--"}
          title={noaaScales ? t(`scales.severity.${noaaScales.current.solarRadiation.label}`) : "--"}
          subtitle={t("scales.solarRadiation.title")}
          containerStyle={{ backgroundColor: getNoaaScaleColor(noaaScales?.current.solarRadiation.scale) }}
        />
      </View>
    </View>
  );
};

export default NoaaScalesCard;
