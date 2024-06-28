import React, { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { comingSoonStyles } from '../styles/screens/cominSoon'
import { routes } from '../helpers/routes'
import { storeData } from '../helpers/storage'
import { onboardingStyles } from '../styles/screens/onboarding'
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch'
import { useSettings } from '../contexts/AppSettingsContext'
import { StackActions } from '@react-navigation/native';


export default function Onboarding({ navigation }: any) {

  const { refreshCurrentUserLocation } = useSettings()

  useEffect(() => {
    (async () => {
      const firstTime = await isFirstLaunch();
      if (!firstTime) {
        navigation.dispatch(
          StackActions.replace(routes.home.path)
        );
      }
    })()
  }, [])

  const handleAccept = async () => {
    await storeData('firstLaunch', 'false');
    refreshCurrentUserLocation()
    navigation.dispatch(
      StackActions.replace(routes.home.path)
    );
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
        <Text style={onboardingStyles.listText}>- Gyroscope</Text>
        <Text style={onboardingStyles.listText}>- Accéléromètre</Text>
        <Text style={onboardingStyles.listText}>- Baromètre</Text>
      </View>
      <Text style={[onboardingStyles.text, { marginTop: 30 }]}>Ce message n'est affiché que <Text style={{ textDecorationLine: 'underline' }}>lors du premier démarrage</Text> de l'application</Text>
      <TouchableOpacity style={comingSoonStyles.button} onPress={() => handleAccept()}>
        <Text style={comingSoonStyles.buttonText}>Accepter</Text>
      </TouchableOpacity>
    </View>
  )
}
