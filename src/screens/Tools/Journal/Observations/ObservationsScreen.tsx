import { View } from "react-native"
import { globalStyles } from "../../../../helpers/globalStyles";
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";

const ObservationsScreen = () => {

  const { t } = useTranslation('tools/journal');

  // Pas de reset au blur : voir le commentaire équivalent dans HomeScreen.tsx (course avec le
  // focus de l'écran suivant).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("observations.title")} main={false} />
      <View style={globalStyles.content}>
      </View>
    </View>
  )
}

export default ObservationsScreen;