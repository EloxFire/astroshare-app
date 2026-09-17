import { ScrollView, View } from "react-native";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { moonCalendarScreenStyles } from "./MoonCalendarScreen.styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import TabSwitch from "./components/TabSwitch/TabSwitch";
import TonightView from "./components/Tonight/TonightView";
import MonthView from "./components/Month/MonthView";
import { useTranslation } from "react-i18next";
const MoonCalendarScreen = () => {
  const { t } = useTranslation("moon");
  

  const [currentView, setCurrentView] = useState<"tonight" | "month">("tonight");
  

  useEffect(() => {
    StatusBar.setStyle("dark");
  }, []);


  const handleTabPress = (tabIndex: number) => {
    if (tabIndex === 0) {
      setCurrentView("tonight");
    } else if (tabIndex === 1) {
      setCurrentView("month");
    }
  }

  return (
    <View style={moonCalendarScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />
      <ScrollView  contentContainerStyle={moonCalendarScreenStyles.content}>
        <TabSwitch
          tabs={[t("tabs.tonight"), t("tabs.month")]}
          activeTab={currentView === "tonight" ? 0 : 1}
          onTabPress={handleTabPress}
        />

        <View style={currentView === "tonight" ? moonCalendarScreenStyles.tonightView : { display: "none" }}>
          <TonightView />
          {/* <Text>{JSON.stringify(computedMoon, null, 2)}</Text> */}

          
        </View>
        {/*
          Monté seulement après la première visite de "Mois", puis gardé en mémoire (display:
          none plutôt que démonté) pour les allers-retours suivants — voir hasVisitedMonth.
        */}
        {currentView === "month" && (
          <View style={{ display: currentView === "month" ? "flex" : "none" }}>
            {/* <MonthView /> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MoonCalendarScreen;
