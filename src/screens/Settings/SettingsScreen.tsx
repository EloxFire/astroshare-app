import { Text, View } from "react-native";
import { settingsScreenStyles } from "./SettingsScreen.styles";

export const SettingsScreen = () => {
  return (
    <View style={settingsScreenStyles.screen}>
      <View style={settingsScreenStyles.content}>
        <Text>Settings Screen</Text>
      </View>
    </View>
  );
};
