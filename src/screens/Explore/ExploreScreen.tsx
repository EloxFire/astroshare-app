import { StatusBar, Text, View } from "react-native";
import { exploreScreenStyles } from "./ExploreScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const ExploreScreen = () => {
  const { t } = useTranslation();

  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
  }, [])

  return (
    <View style={exploreScreenStyles.screen}>
      <ScreenHeader title={t("tabs.explore")} disableBackButton main={false} />
      <Text>{t("placeholders.explore")}</Text>
    </View>
  );
};
