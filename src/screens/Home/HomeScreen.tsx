import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import CurrentConditions from "./components/CurrentConditions/CurrentConditions";
import Tonight from "./components/Tonight/Tonight";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "../../context/GpsContext";

export const HomeScreen = () => {
  const { t } = useTranslation();

  const {loading, error, location} = useLocation();

  useEffect(() => {
      StatusBar.setBarStyle("light-content")
    }, [])

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("home.greeting")} />
      <View style={globalStyles.screen.content}>
        <CurrentConditions />
        <Tonight />
      </View>
    </View>
  );
};
