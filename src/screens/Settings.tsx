import React from "react";
import { View } from "react-native";
import { globalStyles } from "../styles/global";
import { settingsStyles } from "../styles/screens/settings";
import { useSettings } from "../contexts/AppSettingsContext";
import * as Linking from 'expo-linking';
import PageTitle from "../components/commons/PageTitle";
import BigButton from "../components/commons/buttons/BigButton";

export default function Settings({ navigation }: any) {

  const { isNightMode, handleNightMode, isCellularDataEnabled, handleCellularData } = useSettings()

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Paramètres"
        subtitle="// Personnalisez votre application Astroshare"
      />
      <View style={globalStyles.screens.separator} />
      <View style={settingsStyles.content}>
        <BigButton icon={require('../../assets/icons/FiEye.png')} text="Mode nuit" subtitle="// Filtre nocturne (Expérimental)" hasCheckbox isChecked={isNightMode} onPress={() => handleNightMode()} />
        <BigButton icon={require('../../assets/icons/FiWifi.png')} text="Données cellulaires" subtitle="// Utiliser internet même hors wifi" hasCheckbox isChecked={isCellularDataEnabled} onPress={() => handleCellularData()} />
        <BigButton icon={require('../../assets/icons/FiShield.png')} text="Permissions" subtitle="// Gerez les accès de l'application" onPress={() => Linking.openSettings()} />
        <BigButton icon={require('../../assets/icons/FiInfo.png')} text="À propos" subtitle="// Version, contact, legal" navigation={navigation} targetScreen="About" />
      </View>
    </View>
  );
}
