import React from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { i18n } from '../helpers/scripts/i18n'
import { globalStyles } from '../styles/global'
import { useSettings } from '../contexts/AppSettingsContext'
import { HomeWidget } from '../helpers/types/HomeWidget'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import GlobalSummary from '../components/widgets/home/GlobalSummary'
import NightSummary from '../components/widgets/home/NightSummary'
import NextLaunchCountdownWidget from "../components/widgets/home/NextLaunchCountdownWidget";
import DisclaimerBar from "../components/banners/DisclaimerBar";
import {Image} from "expo-image";

export default function WidgetManager({ navigation }: any) {

  const { selectedHomeWidget, updateSelectedHomeWidget } = useSettings()

  const handleWidget = (newWidget: string) => {
    updateSelectedHomeWidget(newWidget)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.widgets.title')}
        subtitle={i18n.t('settings.buttons.widgets.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <DisclaimerBar message={i18n.t('widgetsManager.disclaimer')} type={'info'}/>
        <View style={{ paddingTop: 20 }}>
          {
            Object.keys(HomeWidget).map((widget, index) => {
              return (
                <TouchableOpacity key={`widget-${index}`} onPress={() => handleWidget(widget)} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, borderTopWidth: 1, backgroundColor: app_colors.white_twenty, padding: 10, borderRadius: 10, borderColor: app_colors.white_twenty, borderWidth: 1 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {widget === 'None' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aucun widget</Text>}
                    {widget === 'Live' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aperçu du ciel en direct</Text>}
                    {widget === 'Night' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aperçu de la nuit</Text>}
                    {widget === 'NextLaunchCountdown' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aperçu prochain lancement de fusée</Text>}
                    <Image source={selectedHomeWidget === widget ? require('../../assets/icons/FiToggleFilled.png') : require('../../assets/icons/FiToggleEmpty.png')} style={{ width: 30, height: 30 }} />
                  </View>
                  {widget === 'None' && <></>}
                  {widget === 'Live' && <GlobalSummary />}
                  {widget === 'Night' && <NightSummary />}
                  {widget === 'NextLaunchCountdown' && <NextLaunchCountdownWidget />}
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

const buttonStyle = {

}
