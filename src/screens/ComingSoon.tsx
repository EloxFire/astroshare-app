import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import { comingSoonStyles } from '../styles/screens/cominSoon'
import { routes } from '../helpers/routes'


export default function ComingSoon({ route, navigation }: any) {

  const { pageTitle, pageSubtitle, disclaimer } = route.params

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={pageTitle} subtitle={pageSubtitle} />
      <View style={globalStyles.screens.separator} />
      <Text style={[globalStyles.sections.title, { textAlign: 'center', marginTop: 50 }]}>Bientôt disponible !</Text>
      <Text style={[globalStyles.sections.subtitle, { textAlign: 'center', fontSize: 18, lineHeight: 22, marginTop: 15 }]}>{disclaimer}</Text>
      <TouchableOpacity style={comingSoonStyles.button} onPress={() => navigation.push(routes.home.path)}>
        <Text style={comingSoonStyles.buttonText}>Revenir à l'accueil</Text>
      </TouchableOpacity>
    </View>
  )
}
