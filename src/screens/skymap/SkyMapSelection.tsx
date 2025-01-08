import React from 'react'
import { View, ScrollView } from 'react-native'
import { routes } from '../../helpers/routes'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import { satelliteTrackerHomeStyles } from '../../styles/screens/satelliteTracker/home'
import ToolButton from '../../components/commons/buttons/ToolButton'
import PageTitle from '../../components/commons/PageTitle'
import ScreenInfo from '../../components/ScreenInfo'
import { useSettings } from '../../contexts/AppSettingsContext'
import {useStarCatalog} from "../../contexts/StarsContext";

export default function SkyMapSelection({ navigation }: any) {

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.skymap_generator.title')}
        subtitle={i18n.t('home.buttons.skymap_generator.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={satelliteTrackerHomeStyles.buttons}>
          <ToolButton text={i18n.t('skymap.buttons.flatmap.title')} subtitle={i18n.t('skymap.buttons.flatmap.subtitle')} image={require('../../../assets/images/tools/skymap.png')} onPress={() => navigation.navigate(routes.flatSkymap.path)} />
          <ToolButton isPremium text={i18n.t('skymap.buttons.planetarium.title')} subtitle={i18n.t('skymap.buttons.planetarium.subtitle')} image={require('../../../assets/images/tools/skymap.png')} onPress={() => navigation.navigate(routes.planetarium.path)} />
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiCompass.png')} text={i18n.t('skymap.info')} />
      </ScrollView>
    </View>
  )
}
