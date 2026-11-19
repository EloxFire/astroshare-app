import { useEffect, useMemo, useState } from "react";
import { InteractionManager, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { useLocation } from "../../../../../context/LocationContext";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import ListCard from "../../../../../components/cards/ListCard/ListCard";
import AltitudeChart from "../../../../../components/charts/AltitudeChart/AltitudeChart";
import {
  convertEquatorialToHorizontal,
  getBodyNextRise,
  getBodyNextSet,
  getSolarAngularDiameter,
  getSolarDistance,
  getSolarEquatorialCoordinate,
} from "@observerly/astrometry";
import { findPreviousHorizonCrossing, getAltitudeCurve } from "../../../../../helpers/astrometry/altitude/altitudeCurve";
import { getAstronomicalNightWindow } from "../../../../../helpers/astrometry/night/nightWindow";
import { formatDayRelativeTime, formatDistanceInKm, formatDistanceInUA, formatDuration } from "../../../../../helpers/format";

/**
 * Position du Soleil (altitude/azimut/distance/diamètre apparent) + courbe d'altitude du jour et
 * fenêtre de nuit astronomique. Calcul lourd (trigonométrie + courbe d'altitude) déporté après les
 * interactions (InteractionManager) pour ne pas bloquer l'ouverture de l'écran, comme dans la
 * version d'origine de SpaceWeatherScreen.
 */
const SunSummaryCard = () => {
  const { t, i18n } = useTranslation("tools/spaceWeather");
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const today = useMemo(() => new Date(), []);
  const user = useMemo(() => ({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    altitude: location?.elevation ?? 0,
  }), [location]);
  const [computedSun, setComputedSun] = useState<any>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      console.log(`[SunSummaryCard] Calculating sun data`);

      const now = new Date();
      const eqCoords = getSolarEquatorialCoordinate(now)
      const coords = convertEquatorialToHorizontal(now, user, eqCoords);
      const nextRise = getBodyNextRise(today, user, eqCoords);
      const nextSet = getBodyNextSet(today, user, eqCoords);
      const points = getAltitudeCurve(now, user, getSolarEquatorialCoordinate);

      const currentlyAboveHorizon = coords.alt >= 0;
      const chartRiseDate = currentlyAboveHorizon
        ? findPreviousHorizonCrossing(now, user, getSolarEquatorialCoordinate, "rise")
        : (nextRise ? nextRise.datetime : undefined);
      const chartSetDate = currentlyAboveHorizon
        ? (nextSet ? nextSet.datetime : undefined)
        : findPreviousHorizonCrossing(now, user, getSolarEquatorialCoordinate, "set");

      const daylightDuration = nextRise && nextSet ? (nextSet.datetime.getTime() - nextRise.datetime.getTime()) / 1000 : undefined;

      // getAstronomicalNightWindow gère déjà le souci de fuseau (voir son propre commentaire) via
      // les mêmes primitives findPreviousHorizonCrossing/findNextHorizonCrossing qu'avant ici.
      const nightWindow = getAstronomicalNightWindow(now, user);
      const currentlyInAstronomicalNight = nightWindow?.isCurrentlyNight ?? false;
      // Si on y est déjà, on veut savoir jusqu'à quand (fin de la nuit) — sinon, à partir de quand
      // elle commencera ce soir (début). Absente si le Soleil ne descend jamais sous -18° (ex: été/
      // haute latitude). Voir formatDayRelativeTime.
      const astronomicalNightDate = currentlyInAstronomicalNight ? nightWindow?.end : nightWindow?.start;

      setComputedSun({
        altitudeCurve: points,
        chartRiseDate,
        chartSetDate,
        distance: getSolarDistance(now).toFixed(0),
        diameter: getSolarAngularDiameter(now),
        eqCoords,
        coords,
        rise: nextRise,
        set: nextSet,
        daylightDuration,
        astronomicalNightDate,
        isCurrentlyAstronomicalNight: currentlyInAstronomicalNight,
      });
    })

    return () => task.cancel();
  }, [])

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("sumary.title")}</Text>
      </View>

      <AltitudeChart
        points={computedSun?.altitudeCurve ?? []}
        riseDate={computedSun?.chartRiseDate}
        setDate={computedSun?.chartSetDate}
      />

      <ListCard
        additionalContainerStyles={{ borderWidth: 0, padding: 0, marginTop: 20 }}
        items={[
          {
            title: t("sumary.stats.altitude.title"),
            value: computedSun?.coords?.alt ? `${computedSun.coords.alt.toFixed(2)} °` : "--",
          },
          {
            title: t("sumary.stats.azimuth.title"),
            value: computedSun?.coords?.az ? `${computedSun.coords.az.toFixed(2)} °` : "--",
          },
          {
            title: t("sumary.stats.distance.title"),
            value: computedSun?.distance ? `${formatDistanceInKm(computedSun.distance, i18n.language)} (${formatDistanceInUA(computedSun.distance, i18n.language)})` : "--",
          },
          {
            title: t("sumary.stats.angularDiameter.title"),
            value: computedSun?.diameter ? `${computedSun.diameter.toFixed(2)} °` : "--",
          },
          {
            title: t("sumary.stats.daylightDuration.title"),
            value: computedSun?.daylightDuration ? formatDuration(computedSun.daylightDuration, t) : "--",
          },
          {
            title: t("sumary.stats.astronomicalNight.title"),
            value: formatDayRelativeTime(computedSun?.astronomicalNightDate, !!computedSun?.isCurrentlyAstronomicalNight, t, formatDate, today),
          },
        ]}
      />
    </View>
  );
};

export default SunSummaryCard;
