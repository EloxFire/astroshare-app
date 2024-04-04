import React from 'react'
import { View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'
import { settingsStyles } from '../styles/screens/settings'

export default function Settings({navigation}: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Paramètres" subtitle='// Personnalisez votre application Astroshare' />
      <View style={settingsStyles.separator} />
    </View>
  )
}
