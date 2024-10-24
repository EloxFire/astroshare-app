import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import { routes } from '../../helpers/routes'
import { satelliteTrackerHomeStyles } from '../../styles/screens/satelliteTracker/home'
import PageTitle from '../../components/commons/PageTitle'
import ToolButton from '../../components/commons/buttons/ToolButton'
import ScreenInfo from '../../components/ScreenInfo'
import { useSpacex } from '../../contexts/SpaceXContext'

export default function SatelliteTracker({ navigation }: any) {

  const {constellation} = useSpacex()

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
          <ToolButton disabled={constellation.length === 0} text={i18n.t('satelliteTracker.home.buttons.starlinkTracker.title')} subtitle={i18n.t('satelliteTracker.home.buttons.starlinkTracker.subtitle')} image={require('../../../assets/images/tools/starlinktracker.png')} onPress={() => navigation.navigate(routes.starlinkTracker.path)} />
          <ToolButton disabled text={i18n.t('satelliteTracker.home.buttons.tss.title')} subtitle={i18n.t('satelliteTracker.home.buttons.tss.subtitle')} image={require('../../../assets/images/tools/tiangongtracker.png')} onPress={() => navigation.navigate(routes.starlinkTracker.path)} />
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiIss.png')} text={i18n.t('satelliteTracker.home.info')} />
      </ScrollView>
    </View>
  )
}