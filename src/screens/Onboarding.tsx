import React, { useEffect } from 'react'
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import { globalStyles } from '../styles/global'
import { comingSoonStyles } from '../styles/screens/cominSoon'
import { routes } from '../helpers/routes'
import { storeData } from '../helpers/storage'
import { onboardingStyles } from '../styles/screens/onboarding'
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch'
import { useSettings } from '../contexts/AppSettingsContext'
import { StackActions } from '@react-navigation/native';
import { languageSelectionStyles } from '../styles/screens/languageSelection'
import { i18n } from '../helpers/scripts/i18n'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'


export default function Onboarding({ navigation }: any) {

  const { refreshCurrentUserLocation } = useSettings()

  // useEffect(() => {
  //   (async () => {
  //     const firstTime = await isFirstLaunch();
  //     if (!firstTime) {
  //       navigation.dispatch(
  //         StackActions.replace(routes.home.path)
  //       );
  //     }
  //   })()
  // }, [])

  const changeLocale = async (code: string) => {
    i18n.locale = code
    await storeData('locale', code)
    navigation.replace(routes.onboarding.path)
  }

  const handleAccept = async () => {
    await storeData('firstLaunch', 'false');
    refreshCurrentUserLocation()
    navigation.dispatch(
      StackActions.replace(routes.home.path)
    );
  }

  return (
    <View style={globalStyles.body}>
      <ScrollView>
        <Image source={require('../../assets/logos/astroshare_logo_white.png')} resizeMode="contain" style={{ alignSelf: "center", height: 50, marginBottom: 20 }} />
        <Text style={onboardingStyles.title}>{i18n.t('onboarding.title')}</Text>
        <Text style={onboardingStyles.subtitle}>{i18n.t('onboarding.subtitle')}</Text>
        <Text style={[onboardingStyles.subtitle, { marginBottom: 40 }]}>{i18n.t('onboarding.disclaimer')}</Text>
        <Text style={onboardingStyles.text}>{i18n.t('onboarding.text')}</Text>
        <View style={{ marginTop: 30 }}>
          <Text style={onboardingStyles.listText}>{i18n.t('onboarding.listText')}</Text>
          <Text style={onboardingStyles.listText}>{i18n.t('onboarding.listText2')}</Text>
          <Text style={onboardingStyles.listText}>{i18n.t('onboarding.listText3')}</Text>
          <Text style={onboardingStyles.listText}>{i18n.t('onboarding.listText4')}</Text>
          <Text style={onboardingStyles.listText}>{i18n.t('onboarding.listText5')}</Text>
        </View>
        <Text style={[onboardingStyles.text, { marginTop: 30 }]}>{i18n.t('onboarding.messageShown')}</Text>
        <TouchableOpacity style={comingSoonStyles.button} onPress={() => handleAccept()} disabled={!isFirstLaunch}>
          <Text style={comingSoonStyles.buttonText}>{i18n.t('onboarding.accept')}</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, marginBottom: 80, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={[languageSelectionStyles.content.button, { justifyContent: 'center' }]} onPress={() => changeLocale('fr')}>
            <Text style={languageSelectionStyles.content.button.icon}>{getUnicodeFlagIcon('FR')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[languageSelectionStyles.content.button, { justifyContent: 'center' }]} onPress={() => changeLocale('en')}>
            <Text style={languageSelectionStyles.content.button.icon}>{getUnicodeFlagIcon('GB')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
