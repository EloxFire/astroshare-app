import { Image, Text, View } from "react-native";
import dayjs from "dayjs";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { moonCalendarScreenStyles } from "./MoonCalendarScreen.styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import TabSwitch from "./components/TabSwitch/TabSwitch";
import { useMoon } from "../../../hooks/useMoon";
import { LUNAR_SYNODIC_MONTH } from "../../../helpers/astrometry/moon";

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
            source={{ uri: "https://bucket.astroshare.fr/moon_phases/2026/moon_2026_08_24.png" }}
            style={{ width: 150, height: 150 }}
          />
          <View style={moonCalendarScreenStyles.currentPhaseContainer.infos}>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle}>{dayjs().format("dddd DD MMMM")}</Text>
            <Text style={moonCalendarScreenStyles.currentPhaseContainer.infos.phase}>{moon.getLunarPhaseLabel()}</Text>
            <Text style={[moonCalendarScreenStyles.currentPhaseContainer.infos.subtitle, {textTransform: "none" as const, marginTop: 10}]}>Pleine lune dans {dayjs(moon.getNextFullMoon()).diff(today, "day")} jours</Text>
          </View>
        </View>

        <View style={moonCalendarScreenStyles.lunarCycleProgressContainer}>
          <View style={moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar}>
            <View style={[moonCalendarScreenStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${cycleProgress * 100}%` }]} />
          </View>
          <Text style={moonCalendarScreenStyles.lunarCycleProgressContainer.age}>Jour : {age.toFixed(1)} / {LUNAR_SYNODIC_MONTH.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
};

export default MoonCalendarScreen;
