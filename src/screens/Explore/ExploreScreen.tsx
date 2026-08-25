import { StatusBar, Text, View } from "react-native";
import { exploreScreenStyles } from "./ExploreScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { useEffect } from "react";

export const ExploreScreen = () => {

  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
  }, [])

  return (
    <View style={exploreScreenStyles.screen}>
      <ScreenHeader title="Explorer" disableBackButton main={false} />
      <Text>Explore Screen</Text>
    </View>
  );
};
