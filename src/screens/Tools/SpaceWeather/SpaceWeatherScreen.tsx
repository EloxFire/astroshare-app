import { ScrollView, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { getImf } from "../../../helpers/api/spaceWeather/imf";
import type { ImfData } from "../../../types/spaceWeather/InterplanetaryMagneticField";
import { getSolarWind } from "../../../helpers/api/spaceWeather/wind";
import type { SolarWindData } from "../../../types/spaceWeather/SolarWind";
import SunImageryCard from "./components/SunImageryCard/SunImageryCard";
import SunSummaryCard from "./components/SunSummaryCard/SunSummaryCard";
import KpCard from "./components/KpCard/KpCard";
import OutlookCard from "./components/OutlookCard/OutlookCard";
import NoaaScalesCard from "./components/NoaaScalesCard/NoaaScalesCard";
import MagneticFieldCard from "./components/MagneticFieldCard/MagneticFieldCard";
import AuroraForecastCard from "./components/AuroraForecastCard/AuroraForecastCard";
import SolarWindCard from "./components/SolarWindCard/SolarWindCard";
import EventsCard from "./components/EventsCard/EventsCard";

const SpaceWeatherScreen = () => {

  const { t } = useTranslation("tools/spaceWeather");

  const [imf, setImf] = useState<ImfData | null>(null);
  const [solarWind, setSolarWind] = useState<SolarWindData | null>(null);

  // Le vent solaire et l'IMF évoluent minute par minute (contrairement aux images), mais la doc de
  // l'API indique qu'un refresh toutes les 5-10 min suffit largement côté UI — pas la peine
  // d'interroger en continu. Rafraîchis immédiatement à chaque focus de l'écran (en parallèle), puis
  // toutes les 5 min tant que l'écran reste affiché. Même cadence pour les deux (regroupés dans la
  // doc de l'API), donc un seul minuteur plutôt qu'un par endpoint — fetché ici (parent) et passé en
  // prop à MagneticFieldCard/SolarWindCard plutôt que par chacune de son côté.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const refresh = async () => {
        const [imfData, windData] = await Promise.all([getImf(), getSolarWind()]);
        if (cancelled) return;
        setImf(imfData);
        setSolarWind(windData);
      };

      refresh();
      const interval = setInterval(refresh, 5 * 60 * 1000);

      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }, [])
  );

  // Pas de reset au blur : voir le commentaire équivalent dans HomeScreen.tsx (course avec le
  // focus de l'écran suivant).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <SunImageryCard />
          <SunSummaryCard />
          <KpCard />
          <OutlookCard />
          <NoaaScalesCard />
          <MagneticFieldCard imf={imf} />
          <AuroraForecastCard />
          <SolarWindCard solarWind={solarWind} />
          <EventsCard />
        </View>
      </ScrollView>
    </View>
  )
}

export default SpaceWeatherScreen
