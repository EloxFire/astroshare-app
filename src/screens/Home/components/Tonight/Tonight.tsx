import { View, Text } from "react-native";
import { tonightStyles } from "./Tonight.styles";
import { typography } from "../../../../helpers/variables";
import { useTranslation } from "react-i18next";

export default function Tonight() {
  const { t } = useTranslation();
  return (
    <View style={tonightStyles.container}>
      <View style={tonightStyles.container.header}>
        <Text style={typography.ztNature.cardTitle}>{t("home.tonightSection")}</Text>
      </View>
    </View>
  )
}