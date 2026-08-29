import { Text, View } from "react-native";
import { profileScreenStyles } from "./ProfileScreen.styles";
import { useTranslation } from "react-i18next";

export const ProfileScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={profileScreenStyles.screen}>
      <View style={profileScreenStyles.content}>
        <Text>{t("placeholders.profile")}</Text>
      </View>
    </View>
  );
};
