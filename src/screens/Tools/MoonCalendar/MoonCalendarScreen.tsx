import { Image, Text, View } from "react-native";
import dayjs from "dayjs";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { moonCalendarScreenStyles } from "./MoonCalendarScreen.styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import TabSwitch from "./components/TabSwitch/TabSwitch";
import { useMoon } from "../../../hooks/useMoon";
import { LUNAR_SYNODIC_MONTH } from "../../../helpers/astrometry/moon";

const formatWithSpaces = (value: number): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const MoonCalendarScreen = () => {

  const [activeTab, setActiveTab] = useState(0);

  const today = useMemo(() => new Date(), []);
  const moon = useMoon(today);
  const { age } = moon.getLunarAge();
  const cycleProgress = Math.min(1, age / LUNAR_SYNODIC_MONTH);

  useEffect(() => {
    StatusBar.setStyle("dark");
  }, [])

  return (
    <View style={moonCalendarScreenStyles.screen}>
      <ScreenHeader title="Calendrier lunaire" main={false} />
      <View style={moonCalendarScreenStyles.content}>
        <TabSwitch
          tabs={["Ce soir", "Mois"]}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <View style={moonCalendarScreenStyles.currentPhaseContainer}>
          <Image
            source={{ uri: "https://bucket.astroshare.fr/moon_phases/2026/moon_2026_08_25.png" }}
            style={{ width: 150, height: 150 }}
          />
          <View style={moonCalendarScreenStyles.currentPhaseContainer.infos}>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle}>{dayjs().format("dddd DD MMMM")}</Text>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.phase}>{moon.getLunarPhaseLabel()}</Text>
            <Text style={[moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle, {textTransform: "none" as const, marginTop: 10}]}>
              {dayjs(moon.getNextFullMoon()).isAfter(moon.getNextNewMoon()) 
                ? `Nouvelle Lune dans ${dayjs(moon.getNextNewMoon()).diff(today, "day")} jours` 
                : `Pleine lune dans ${dayjs(moon.getNextFullMoon()).diff(today, "day")} jours`}
            </Text>
          </View>
        </View>

        <View style={moonCalendarScreenStyles.lunarCycleProgressContainer}>
          <View style={moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar}>
            <View style={[moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${cycleProgress * 100}%` }]} />
          </View>
          <Text style={moonCalendarScreenStyles.lunarCycleProgressContainer.age}>Jour : {age.toFixed(1)} / {LUNAR_SYNODIC_MONTH.toFixed(1)}</Text>
        </View>

        <View style={moonCalendarScreenStyles.mainInfoBlocs}>
          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>Illumination</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{(moon.getLunarIllumination()).toFixed(1)}%</Text>
          </View>

          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>âge</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{moon.getLunarAge().age.toFixed(0)} j</Text>
          </View>

          <View style={moonCalendarScreenStyles.mainInfoBlocs.bloc}>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.title}>Diamètre</Text>
            <Text style={moonCalendarScreenStyles.mainInfoBlocs.bloc.value}>{moon.getLunarAngularDiameter().toFixed(2)}°</Text>
          </View>
        </View>

        <View style={moonCalendarScreenStyles.ephemerisContainer}>
          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>Lever</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>15:40 - est-sud-est</Text>
          </View>

          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>Culmination</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>22:47 - 41°</Text>
          </View>

          <View style={[moonCalendarScreenStyles.ephemerisContainer.bloc, moonCalendarScreenStyles.ephemerisContainer.bloc.withBorder]}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>Coucher</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>02:18 - ouest-sud-ouest</Text>
          </View>

          <View style={moonCalendarScreenStyles.ephemerisContainer.bloc}>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.title}>Distance</Text>
            <Text style={moonCalendarScreenStyles.ephemerisContainer.bloc.value}>{formatWithSpaces(Math.round(moon.getLunarDistance() / 1000))} km</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MoonCalendarScreen;
