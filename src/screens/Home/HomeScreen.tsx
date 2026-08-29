import { StatusBar, Text, View } from "react-native";
import { homeScreenStyles } from "./HomeScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import CurrentConditions from "./components/CurrentConditions/CurrentConditions";
import Tonight from "./components/Tonight/Tonight";
import { useEffect } from "react";
import useMoon from "../../hooks/useMoon";
import { useTranslation } from "react-i18next";

export const HomeScreen = () => {
  const { t } = useTranslation();

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
