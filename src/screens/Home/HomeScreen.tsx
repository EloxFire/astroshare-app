import { StatusBar, Text, View } from "react-native";
import { homeScreenStyles } from "./HomeScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import CurrentConditions from "./components/CurrentConditions/CurrentConditions";
import Tonight from "./components/Tonight/Tonight";
import { useEffect } from "react";
import useMoon from "../../hooks/useMoon";

export const HomeScreen = () => {

  useEffect(() => {
      StatusBar.setBarStyle("light-content")
    }, [])

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={"Belle nuit\npour observer"} />
      <View style={globalStyles.screen.content}>
        <CurrentConditions />
        <Tonight />
      </View>
    </View>
  );
};
