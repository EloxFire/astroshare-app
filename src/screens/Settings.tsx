import React from "react";
import {ScrollView, Text, View} from "react-native";
import { globalStyles } from "../styles/global";
import { settingsStyles } from "../styles/screens/settings";
import { useSettings } from "../contexts/AppSettingsContext";
import { routes } from "../helpers/routes";
import { i18n } from "../helpers/scripts/i18n";
import * as Linking from 'expo-linking';
import PageTitle from "../components/commons/PageTitle";
import BigButton from "../components/commons/buttons/BigButton";
import ToolButton from "../components/commons/buttons/ToolButton";
import {useAuth} from "../contexts/AuthContext";
import {isProUser} from "../helpers/scripts/auth/checkUserRole";

export default function Settings({ navigation }: any) {

  const { isNightMode, handleNightMode, isCellularDataEnabled, handleCellularData } = useSettings()
  const {currentUser} = useAuth()

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
          <Text style={[settingsStyles.content.categoryTitle, {marginTop: 0}]}>{i18n.t('settings.categories.general')}</Text>
          <BigButton icon={require('../../assets/icons/FiEye.png')} text={i18n.t('settings.buttons.nightMode.title')} subtitle={i18n.t('settings.buttons.nightMode.subtitle')} hasCheckbox isChecked={isNightMode} onPress={() => handleNightMode()} />
          <BigButton icon={require('../../assets/icons/FiTranslation.png')} text={i18n.t('settings.buttons.language.title')} subtitle={i18n.t('settings.buttons.language.subtitle')} targetScreen={routes.language.path} navigation={navigation} />
          <BigButton icon={require('../../assets/icons/FiLifeBuoy.png')} text={i18n.t('settings.buttons.tutorial.title')} subtitle={i18n.t('settings.buttons.tutorial.subtitle')} targetScreen={routes.tutorial.path} navigation={navigation} />
          <Text style={settingsStyles.content.categoryTitle}>{i18n.t('settings.categories.appearance')}</Text>
          <BigButton icon={require('../../assets/icons/FiWidget.png')} text={i18n.t('settings.buttons.widgets.title')} subtitle={i18n.t('settings.buttons.widgets.subtitle')} navigation={navigation} targetScreen={routes.widgetsManager.path} />
          <BigButton icon={require('../../assets/icons/FiViewPoint.png')} text={i18n.t('settings.buttons.favoritesViewPoints.title')} subtitle={i18n.t('settings.buttons.favoritesViewPoints.subtitle')} navigation={navigation} targetScreen={routes.favoritesViewPoints.path} />
          <Text style={settingsStyles.content.categoryTitle}>{i18n.t('settings.categories.infos')}</Text>
          <BigButton icon={require('../../assets/icons/FiInfo.png')} text={i18n.t('settings.buttons.about.title')} subtitle={i18n.t('settings.buttons.about.subtitle')} navigation={navigation} targetScreen={routes.about.path} />
          <BigButton icon={require('../../assets/icons/FiFileText.png')} text={i18n.t('settings.buttons.changelog.title')} subtitle={i18n.t('settings.buttons.changelog.subtitle')} navigation={navigation} targetScreen={routes.changelogScreen.path} />
          <BigButton icon={require('../../assets/icons/FiDataInspect.png')} text={i18n.t('settings.buttons.data.title')} subtitle={i18n.t('settings.buttons.data.subtitle')} targetScreen={routes.astroDataInfos.path} navigation={navigation} />
          <BigButton icon={require('../../assets/icons/FiShield.png')} text={i18n.t('settings.buttons.permissions.title')} subtitle={i18n.t('settings.buttons.permissions.subtitle')} onPress={() => Linking.openSettings()} />
          {/* <BigButton disabled icon={require('../../assets/icons/FiWifi.png')} text={i18n.t('settings.buttons.cellularData.title')} subtitle={i18n.t('settings.buttons.cellularData.subtitle')} hasCheckbox isChecked={isCellularDataEnabled} onPress={() => handleCellularData()} /> */}
        </View>
      </ScrollView>
    </View>
  );
}
