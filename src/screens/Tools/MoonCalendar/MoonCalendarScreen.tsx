import { Image, Text, View } from "react-native";
import dayjs from "dayjs";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { moonCalendarScreenStyles } from "./MoonCalendarScreen.styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import TabSwitch from "./components/TabSwitch/TabSwitch";
import { useMoon } from "../../../hooks/useMoon";
import { useObservatory } from "../../../hooks/useObservatory";
import { LUNAR_SYNODIC_MONTH, type Observer, type TransitInstance } from "../../../helpers/astrometry/moon";
import { convertAzimuthToCardinalDirection } from "../../../helpers/location/convert";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const formatWithSpaces = (value: number): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Affiche l'heure + le point cardinal d'un lever/coucher ; gère les cas
// particuliers (jamais de lever/coucher pour cet observateur) et l'attente
// de la position (observer pas encore résolu, requireObserver() interdit l'appel).
const formatTransit = (transit: TransitInstance | boolean | undefined, t: TFunction): string => {
  if (transit === undefined) return t("transit.loading");
  if (transit === false) return t("transit.notApplicable");
  if (transit === true) return t("transit.neverSets");
  return `${dayjs(transit.datetime).format("HH:mm")} - ${convertAzimuthToCardinalDirection(transit.az)}`;
};

const MoonCalendarScreen = () => {
  const { t } = useTranslation("moon");

  const [activeTab, setActiveTab] = useState(0);

  const today = useMemo(() => new Date(), []);
  const { position } = useObservatory();

  const observer: Observer | undefined = useMemo(
    () => (position ? { ...position, datetime: today } : undefined),
    [position, today]
  );

  const moon = useMoon(today, observer);
  const { age } = moon.getLunarAge();
  const cycleProgress = Math.min(1, age / LUNAR_SYNODIC_MONTH);

  const nextRise = observer ? moon.getLunarNextRise() : undefined;
  const nextSet = observer ? moon.getLunarNextSet() : undefined;

  const isNewMoonNext = !dayjs(moon.getNextFullMoon()).isAfter(moon.getNextNewMoon());
  const daysUntilNextPhase = isNewMoonNext
    ? dayjs(moon.getNextNewMoon()).diff(today, "day")
    : dayjs(moon.getNextFullMoon()).diff(today, "day");

  useEffect(() => {
    StatusBar.setStyle("dark");
  }, [])

  return (
    <View style={moonCalendarScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />
      <View style={moonCalendarScreenStyles.content}>
        <TabSwitch
          tabs={[t("tabs.tonight"), t("tabs.month")]}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <View style={moonCalendarScreenStyles.currentPhaseContainer}>
          <Image
            source={{ uri: "https://bucket.astroshare.fr/moon_phases/2026/moon_2026_08_29.png" }}
            style={{ width: 150, height: 150 }}
          />
          <View style={moonCalendarScreenStyles.currentPhaseContainer.infos}>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle}>{dayjs().format("dddd DD MMMM")}</Text>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.phase}>{moon.getLunarPhaseLabel()}</Text>
            <Text style={[moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle, {textTransform: "none" as const, marginTop: 10}]}>
              {t(isNewMoonNext ? "daysUntil.newMoon" : "daysUntil.fullMoon", { count: daysUntilNextPhase })}
            </Text>
          </View>
        </View>

        <View style={moonCalendarScreenStyles.lunarCycleProgressContainer}>
          <View style={moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar}>
            <View style={[moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${cycleProgress * 100}%` }]} />
          </View>
          <Text style={moonCalendarScreenStyles.lunarCycleProgressContainer.age}>{t("dayProgress", { age: age.toFixed(1), total: LUNAR_SYNODIC_MONTH.toFixed(1) })}</Text>
        </View>

        <View style={moonCalendarScreenStyles.mainInfoBlocs}>
          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>{t("stats.illumination")}</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{(moon.getLunarIllumination()).toFixed(1)}%</Text>
          </View>

          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>{t("stats.age")}</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{t("stats.ageValue", { value: moon.getLunarAge().age.toFixed(0) })}</Text>
          </View>

          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>{t("stats.diameter")}</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{moon.getLunarAngularDiameter().toFixed(2)}°</Text>
          </View>
        </View>

        <View style={moonCalendarScreenStyles.ephemerisContainer}>
          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>{t("ephemeris.rise")}</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>{formatTransit(nextRise, t)}</Text>
          </View>

          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>{t("ephemeris.culmination")}</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>22:47 - 41°</Text>
          </View>

          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>{t("ephemeris.set")}</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>{formatTransit(nextSet, t)}</Text>
          </View>

          <View style={moonCalendarScreenStyles.ephemerisContainer.bloc}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>{t("ephemeris.distance")}</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>{t("ephemeris.distanceValue", { value: formatWithSpaces(Math.round(moon.getLunarDistance() / 1000)) })}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MoonCalendarScreen;
