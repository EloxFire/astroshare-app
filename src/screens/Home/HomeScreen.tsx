import { Text, View } from "react-native";
import { homeScreenStyles } from "./HomeScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";

export const HomeScreen = () => {
  return (
    <View style={homeScreenStyles.screen}>
      <ScreenHeader title="Accueil" />
      <Text>Index Screen</Text>
    </View>
  );
};
