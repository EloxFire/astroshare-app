import React, { useEffect, useState } from 'react'
import { Keyboard, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import { DSO } from '../helpers/types/DSO';
import { app_colors } from '../helpers/constants';
import { useSettings } from '../contexts/AppSettingsContext';
import { showToast } from '../helpers/scripts/showToast';
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch';
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/buttons/BigButton';
import axios from 'axios';
import HomeSearchResults from '../components/HomeSearchResults';
import BannerHandler from '../components/banners/BannerHandler';
import ToolButton from '../components/commons/buttons/ToolButton';
import HomeSearchModule from '../components/forms/HomeSearchModule';

export default function Home({ navigation }: any) {
  const { hasInternetConnection, currentUserLocation } = useSettings()

  useEffect(() => {
    (async () => {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        navigation.navigate(routes.onboarding.path)
      }
    })()
  }, [])

  return (
    <View style={globalStyles.body}>
      <AppHeader navigation={navigation} />
      <BannerHandler />
      <LocationHeader />
      <HomeSearchModule navigation={navigation} />
      <ScrollView style={{ borderTopWidth: 1, borderTopColor: app_colors.white_forty }}>
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>Vos outils</Text>
          <Text style={globalStyles.sections.subtitle}>Votre caisse à outils personnalisée</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.weather.path} text="Météo en direct" subtitle="// C'est le moment de sortir le téléscope !" icon={require('../../assets/icons/FiSun.png')} />
            <BigButton disabled={!currentUserLocation} navigation={navigation} targetScreen={routes.scopeAlignment.path} text="Mise en station" subtitle='// Votre assistant de mise en station' icon={require('../../assets/icons/FiCompass.png')} />
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.moonPhases.path} text="Phases de la Lune" subtitle='// Calculez les phases de la Lune' icon={require('../../assets/icons/FiMoon.png')} />
            <BigButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.solarWeather.path} text="Météo solaire" subtitle="// Situation de nôtre étoile en temps réel !" icon={require('../../assets/icons/SolarWind.png')} />
          </View>
        </View>
        <View style={homeStyles.nasaTools}>
          <Text style={globalStyles.sections.title}>Autres outils</Text>
          <Text style={globalStyles.sections.subtitle}>Explorez toujours plus !</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.apod.path} text="APOD" subtitle="// Image du jour de la NASA" image={require('../../assets/images/tools/apod.png')} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.satelliteTracker.path} text="ISS Tracker" subtitle="// Position de l'ISS en temps réel" image={require('../../assets/images/tools/isstracker.png')} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.skymapgenerator.path} text="Carte du ciel" subtitle="// Carte du ciel en direct" image={require('../../assets/images/tools/skymap.png')} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
