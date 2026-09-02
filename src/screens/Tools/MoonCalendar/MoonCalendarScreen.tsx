import { View } from "react-native";
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

  // MonthView n'est monté qu'à la première visite de l'onglet "Mois", puis reste monté
  // ensuite (display: none/flex ci-dessous) — le monter immédiatement avec TonightView
  // ralentissait l'arrivée sur l'écran depuis la tabbar Outils, pour un onglet que
  // l'utilisateur ne regarde pas forcément. Une fois visité, on le garde en mémoire pour
  // éviter de refaire le calcul des phases du mois (coûteux, voir useMonthlyMoonPhases) à
  // chaque aller-retour entre les deux onglets.
  const [hasVisitedMonth, setHasVisitedMonth] = useState(false);

  const handleTabPress = (index: number) => {
    const view = index === 0 ? "tonight" : "month";
    setCurrentView(view);
    if (view === "month") setHasVisitedMonth(true);
  };

  useEffect(() => {
    StatusBar.setStyle("dark");
  }, []);

  return (
    <View style={moonCalendarScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />
      <View style={moonCalendarScreenStyles.content}>
        <TabSwitch
          tabs={[t("tabs.tonight"), t("tabs.month")]}
          activeTab={currentView === "tonight" ? 0 : 1}
          onTabPress={handleTabPress}
        />

        <View style={{ display: currentView === "tonight" ? "flex" : "none" }}>
          <TonightView />
        </View>
        {/*
          Monté seulement après la première visite de "Mois", puis gardé en mémoire (display:
          none plutôt que démonté) pour les allers-retours suivants — voir hasVisitedMonth.
        */}
        {hasVisitedMonth && (
          <View style={{ display: currentView === "month" ? "flex" : "none" }}>
            <MonthView />
          </View>
        )}
      </View>
    </View>
  );
};

export default MoonCalendarScreen;
