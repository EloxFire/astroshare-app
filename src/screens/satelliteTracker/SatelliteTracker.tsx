import React from 'react'
import { ScrollView, View } from 'react-native'
import PageTitle from '../../components/commons/PageTitle'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'

export default function SatelliteTracker({ navigation }: any) {

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.home.title')}
        subtitle={i18n.t('satelliteTracker.home.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>

      </ScrollView>
    </View>
  )
}