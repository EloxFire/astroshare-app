import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import { satelliteTrackerHomeStyles } from '../../styles/screens/satelliteTracker/home'
import ToolButton from '../../components/commons/buttons/ToolButton'
import { routes } from '../../helpers/routes'
import ScreenInfo from '../../components/ScreenInfo'

export default function SatelliteTracker({ navigation }: any) {

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.satellite_tracker.title')}
        subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={satelliteTrackerHomeStyles.buttons}>
          <ToolButton text={i18n.t('satelliteTracker.home.buttons.issTracker.title')} subtitle={i18n.t('satelliteTracker.home.buttons.issTracker.subtitle')} image={require('../../../assets/images/tools/isstracker.png')} onPress={() => navigation.navigate(routes.issTracker.path)} />
          <ToolButton disabled text={i18n.t('satelliteTracker.home.buttons.tss.title')} subtitle={i18n.t('satelliteTracker.home.buttons.tss.subtitle')} image={require('../../../assets/images/tools/tiangongtracker.png')} onPress={() => navigation.navigate(routes.starlinkTracker.path)} />
          <ToolButton disabled text={i18n.t('satelliteTracker.home.buttons.starlinkTracker.title')} subtitle={i18n.t('satelliteTracker.home.buttons.starlinkTracker.subtitle')} image={require('../../../assets/images/tools/starlinktracker.png')} onPress={() => navigation.navigate(routes.starlinkTracker.path)} />
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiIss.png')} text={i18n.t('satelliteTracker.home.info')} />
      </ScrollView>
    </View>
  )
}