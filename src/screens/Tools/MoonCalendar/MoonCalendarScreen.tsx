import { ScrollView, View } from "react-native";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { moonCalendarScreenStyles } from "./MoonCalendarScreen.styles";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import TabSwitch from "./components/TabSwitch/TabSwitch";
import TonightView from "./components/Tonight/TonightView";
import { useTranslation } from "react-i18next";
import { app_colors } from "../../../helpers/variables";
import { useFocusEffect } from "expo-router";
import MonthView from "./components/Month/MonthView";


const MoonCalendarScreen = () => {
  
  const { t } = useTranslation("moon");
  const [currentView, setCurrentView] = useState<"tonight" | "month">("tonight");
  

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );


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
      <ScrollView >
        <View style={moonCalendarScreenStyles.content}>
          <TabSwitch
            tabs={[
              {
                text: t("tabs.tonight"),
              },
              {
                text: t("tabs.month"),
              }
            ]}
            activeTabForegroundColor={app_colors.primary.main}
            
            activeTab={currentView === "tonight" ? 0 : 1}
            onTabPress={handleTabPress}
          />

          <View style={currentView === "tonight" ? moonCalendarScreenStyles.tonightView : { display: "none" }}>
            <TonightView />
          </View>
          {currentView === "month" && (
            <View style={{ display: currentView === "month" ? "flex" : "none" }}>
              <MonthView />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MoonCalendarScreen;
