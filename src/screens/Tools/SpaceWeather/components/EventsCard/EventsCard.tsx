import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { getSolarFlares } from "../../../../../helpers/api/spaceWeather/solarFlares";
import type { SolarFlaresData } from "../../../../../types/spaceWeather/SolarFlares";
import { getSpaceWeatherAlerts } from "../../../../../helpers/api/spaceWeather/alerts";
import type { SpaceWeatherAlertsData } from "../../../../../types/spaceWeather/SpaceWeatherAlerts";
import SpaceWeatherEvents from "../../../../../components/charts/SpaceWeatherEvents/SpaceWeatherEvents";
import { eventsCardStyles } from "./EventsCard.styles";

/**
 * Éruptions significatives (M/X) et alertes NOAA récentes — les deux viennent de routes distinctes
 * mais alimentent le même composant d'affichage (SpaceWeatherEvents), donc regroupées dans un seul
 * effet ici plutôt que deux cartes séparées. Pas de minuteur : simple refresh au focus de l'écran
 * (évènements, pas une valeur continue).
 */
const EventsCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const [solarFlares, setSolarFlares] = useState<SolarFlaresData | null>(null);
  const [spaceWeatherAlerts, setSpaceWeatherAlerts] = useState<SpaceWeatherAlertsData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [flares, alerts] = await Promise.all([
          getSolarFlares(),
          getSpaceWeatherAlerts(),
        ]);
        setSolarFlares(flares);
        setSpaceWeatherAlerts(alerts);
      })();
    }, [])
  );

  return (
    <View style={eventsCardStyles.container}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("events.title")}</Text>
        {/* TODO : Implémenter l'écran "voir tout" */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={eventsCardStyles.link}>{t("events.all")}</Text>
        </TouchableOpacity>
      </View>

      <View style={eventsCardStyles.list}>
        <SpaceWeatherEvents alerts={spaceWeatherAlerts} flares={solarFlares} />
      </View>
    </View>
  );
};

export default EventsCard;
