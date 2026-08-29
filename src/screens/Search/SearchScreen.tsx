import { Text, View } from "react-native";
import { searchScreenStyles } from "./SearchScreen.styles";
import { useTranslation } from "react-i18next";

export const SearchScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={searchScreenStyles.screen}>
      <Text>{t("placeholders.search")}</Text>
    </View>
  );
};
