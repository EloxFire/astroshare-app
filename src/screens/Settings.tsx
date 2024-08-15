import React from "react";
import { ScrollView, View } from "react-native";
import { globalStyles } from "../styles/global";
import { settingsStyles } from "../styles/screens/settings";
import { useSettings } from "../contexts/AppSettingsContext";
import { routes } from "../helpers/routes";
import { i18n } from "../helpers/scripts/i18n";
import * as Linking from 'expo-linking';
import PageTitle from "../components/commons/PageTitle";
import BigButton from "../components/commons/buttons/BigButton";

export default function Settings({ navigation }: any) {

  const { isNightMode, handleNightMode, isCellularDataEnabled, handleCellularData } = useSettings()

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.title')}
        subtitle={i18n.t('settings.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={settingsStyles.content}>
          <BigButton icon={require('../../assets/icons/FiEye.png')} text={i18n.t('settings.buttons.nightMode.title')} subtitle={i18n.t('settings.buttons.nightMode.subtitle')} hasCheckbox isChecked={isNightMode} onPress={() => handleNightMode()} />
          <BigButton disabled icon={require('../../assets/icons/FiWifi.png')} text={i18n.t('settings.buttons.cellularData.title')} subtitle={i18n.t('settings.buttons.cellularData.subtitle')} hasCheckbox isChecked={isCellularDataEnabled} onPress={() => handleCellularData()} />
          <BigButton icon={require('../../assets/icons/FiViewPoint.png')} text={i18n.t('settings.buttons.favoritesViewPoints.title')} subtitle={i18n.t('settings.buttons.favoritesViewPoints.subtitle')} navigation={navigation} targetScreen={routes.favoritesViewPoints.path} />
          <BigButton icon={require('../../assets/icons/FiTranslation.png')} text={i18n.t('settings.buttons.language.title')} subtitle={i18n.t('settings.buttons.language.subtitle')} targetScreen="LanguageSelection" navigation={navigation} />
          <BigButton icon={require('../../assets/icons/FiShield.png')} text={i18n.t('settings.buttons.permissions.title')} subtitle={i18n.t('settings.buttons.permissions.subtitle')} onPress={() => Linking.openSettings()} />
          <BigButton icon={require('../../assets/icons/FiInfo.png')} text={i18n.t('settings.buttons.about.title')} subtitle={i18n.t('settings.buttons.about.subtitle')} navigation={navigation} targetScreen={routes.about.path} />
        </View>
      </ScrollView>
    </View>
  );
}
