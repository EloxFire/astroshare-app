import React from 'react'
import { View, ScrollView } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import ToolButton from '../../components/commons/buttons/ToolButton'
import ScreenInfo from '../../components/ScreenInfo'
import {routes} from "../../helpers/routes";

export default function TransitsScreen({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.transits.title')}
        subtitle={i18n.t('home.buttons.transits.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View>
          <ToolButton targetScreen={routes.transits.planetary.path} navigation={navigation} text={i18n.t('transits.planetaryConjunction.title')} subtitle={i18n.t('transits.planetaryConjunction.subtitle')} image={require('../../../assets/images/tools/conjunction.png')} />
          <ToolButton disabled isPremium navigation={navigation} text={i18n.t('transits.lunarEclipse.title')} subtitle={i18n.t('transits.lunarEclipse.subtitle')} image={require('../../../assets/images/tools/lunareclipse.png')} />
          <ToolButton disabled isPremium navigation={navigation} text={i18n.t('transits.solarEclipse.title')} subtitle={i18n.t('transits.solarEclipse.subtitle')} image={require('../../../assets/images/tools/solareclipse.png')} />
          <ToolButton disabled isPremium navigation={navigation} text={i18n.t('transits.issTransit.title')} subtitle={i18n.t('transits.issTransit.subtitle')} image={require('../../../assets/images/tools/isstransit.png')} />
          <ScreenInfo text={i18n.t('transits.info')} image={require("../../../assets/icons/FiTransit.png")} />
        </View>
      </ScrollView>
    </View>
  )
}
