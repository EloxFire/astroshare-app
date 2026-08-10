import { Text, View } from "react-native";
import { exploreScreenStyles } from "./ExploreScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";

export const ExploreScreen = () => {
  return (
    <View style={exploreScreenStyles.screen}>
      <ScreenHeader title="Explorer" />
      <Text>Explore Screen</Text>
    </View>
  );
};
