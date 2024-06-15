import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import { comingSoonStyles } from '../styles/screens/cominSoon'
import { routes } from '../helpers/routes'
import { removeData, storeData } from '../helpers/storage'
import { onboardingStyles } from '../styles/screens/onboarding'


export default function Onboarding({ navigation }: any) {

  const handleAccept = async () => {
    await storeData('firstLaunch', 'false');
    navigation.navigate(routes.home.path)
  }

  return (
    <View style={globalStyles.body}>
      <Image source={require('../../assets/logos/astroshare_logo_white.png')} resizeMode="contain" style={{ alignSelf: "center", height: 50, marginBottom: 20 }} />
      <Text style={onboardingStyles.title}>Bienvenue !</Text>
      <Text style={onboardingStyles.subtitle}>Merci d'avoir téléchargé l'application Astroshare !</Text>
      <Text style={[onboardingStyles.subtitle, { marginBottom: 40 }]}>Voici quelques informations importantes :</Text>
      <Text style={onboardingStyles.text}>Pour que l'application Astroshare soit fonctionnelle et la plus pertinante possible, cette dernière à accès aux informations suivantes :</Text>
      <View style={{ marginTop: 30 }}>
        <Text style={onboardingStyles.listText}>- Votre position géographique lorsque l\'application est en cours d'utilisation</Text>
        <Text style={onboardingStyles.listText}>- Votre position géographique lorsque l\'application est en tâche de fond</Text>
        <Text style={onboardingStyles.listText}>- Les différents capteurs de votre téléphone (Gyroscope, Accéléromètre)</Text>
      </View>
      <TouchableOpacity style={comingSoonStyles.button} onPress={() => handleAccept()}>
        <Text style={comingSoonStyles.buttonText}>Accepter</Text>
      </TouchableOpacity>
    </View>
  )
}
