import React from 'react'
import { View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'


export default function SkyMapGenerator({ navigation }: any) {

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Carte du ciel" subtitle="// Carte du ciel en direct" />
      <View style={globalStyles.screens.separator} />

      <View id='celestial-map'></View>
    </View>
  )
}
