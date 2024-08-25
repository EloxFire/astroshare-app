import React from 'react'
import { View, ScrollView } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import ToolButton from '../../components/commons/buttons/ToolButton'
import ScreenInfo from '../../components/ScreenInfo'

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
          <ToolButton navigation={navigation} text={i18n.t('transits.lunarEclipse.title')} subtitle={i18n.t('transits.lunarEclipse.subtitle')} image={require('../../../assets/images/tools/lunareclipse.png')} />
          <ToolButton navigation={navigation} text={i18n.t('transits.solarEclipse.title')} subtitle={i18n.t('transits.solarEclipse.subtitle')} image={require('../../../assets/images/tools/solareclipse.png')} />
          <ToolButton navigation={navigation} text={i18n.t('transits.issTransit.title')} subtitle={i18n.t('transits.issTransit.subtitle')} image={require('../../../assets/images/tools/isstransit.png')} />
          <ScreenInfo text={i18n.t('transits.info')} image={require("../../../assets/icons/FiTransit.png")} />
        </View>
      </ScrollView>
    </View>
  )
}
