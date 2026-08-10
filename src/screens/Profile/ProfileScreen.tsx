import { Text, View } from "react-native";
import { profileScreenStyles } from "./ProfileScreen.styles";

export const ProfileScreen = () => {
  return (
    <View style={profileScreenStyles.screen}>
      <View style={profileScreenStyles.content}>
        <Text>Profile Screen</Text>
      </View>
    </View>
  );
};
