import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import { comingSoonStyles } from '../styles/screens/cominSoon'
import { routes } from '../helpers/routes'
import { removeData, storeData } from '../helpers/storage'
import { onboardingStyles } from '../styles/screens/onboarding'
import { useSettings } from '../contexts/AppSettingsContext'


export default function Onboarding({ navigation }: any) {

  const { checkFirstLaunch } = useSettings()

  const handleAccept = async () => {
    await storeData('firstLaunch', 'false');
    navigation.navigate(routes.home.path)
    checkFirstLaunch(navigation)
  }

  return (
    <View style={globalStyles.body}>
      <Image source={require('../../assets/logos/astroshare_logo_white.png')} resizeMode="contain" style={{ alignSelf: "center", height: 50, marginBottom: 20 }} />
      <Text style={onboardingStyles.title}>Bienvenue !</Text>
      <Text style={onboardingStyles.subtitle}>Merci d'avoir téléchargé l'application Astroshare !</Text>
      <Text style={[onboardingStyles.subtitle, { marginBottom: 40 }]}>Voici quelques informations importantes :</Text>
      <Text style={onboardingStyles.text}>Pour que l'application Astroshare soit fonctionnelle et la plus pertinante possible, cette dernière à accès aux informations suivantes :</Text>
      <View style={{ marginTop: 30 }}>
        <Text style={onboardingStyles.listText}>- Position géographique lors de l'utilisation</Text>
        <Text style={onboardingStyles.listText}>- Position géographique en tâche de fond</Text>
        <Text style={onboardingStyles.listText}>- Gyroscope</Text>
        <Text style={onboardingStyles.listText}>- Accéléromètre</Text>
      </View>
      <TouchableOpacity style={comingSoonStyles.button} onPress={() => handleAccept()}>
        <Text style={comingSoonStyles.buttonText}>Accepter</Text>
      </TouchableOpacity>
    </View>
  )
}
