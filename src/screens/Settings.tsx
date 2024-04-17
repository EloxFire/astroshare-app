import React from "react";
import { View } from "react-native";
import { globalStyles } from "../styles/global";
import PageTitle from "../components/commons/PageTitle";
import { settingsStyles } from "../styles/screens/settings";
import { useSettings } from "../contexts/AppSettingsContext";
import BigButton from "../components/commons/buttons/BigButton";

export default function Settings({ navigation }: any) {

  const { isNightMode, setIsNightMode } = useSettings()

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Paramètres"
        subtitle="// Personnalisez votre application Astroshare"
      />
      <View style={globalStyles.screens.separator} />
      <View style={settingsStyles.content}>
        <BigButton icon={require('../../assets/icons/FiEye.png')} text="Mode nuit" subtitle="// Filtre nocturne" hasCheckbox isChecked={isNightMode} onPress={() => setIsNightMode(!isNightMode)} />
        <BigButton icon={require('../../assets/icons/FiInfo.png')} text="À propos" subtitle="// Version, contact, legal" />
      </View>
    </View>
  );
}
