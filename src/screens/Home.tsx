import React, { useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import { app_colors } from '../helpers/constants';
import { useSettings } from '../contexts/AppSettingsContext';
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch';
import { i18n } from '../helpers/scripts/i18n';
import LocationHeader from '../components/LocationHeader';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/buttons/BigButton';
import BannerHandler from '../components/banners/BannerHandler';
import ToolButton from '../components/commons/buttons/ToolButton';
import HomeSearchModule from '../components/forms/HomeSearchModule';

export default function Home({ navigation }: any) {
  const { hasInternetConnection, currentUserLocation } = useSettings()

  useEffect(() => {
    (async () => {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        navigation.push(routes.onboarding.path)
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
          <Text style={globalStyles.sections.title}>{i18n.t('home.tools.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.tools.subtitle')}</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.weather.path} text={i18n.t('home.buttons.weather.title')} subtitle={i18n.t('home.buttons.weather.subtitle')} icon={require('../../assets/icons/FiSun.png')} />
            <BigButton disabled={!currentUserLocation} navigation={navigation} targetScreen={routes.scopeAlignment.path} text={i18n.t('home.buttons.scope_alignment.title')} subtitle={i18n.t('home.buttons.scope_alignment.subtitle')} icon={require('../../assets/icons/FiCompass.png')} />
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.moonPhases.path} text={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} icon={require('../../assets/icons/FiMoon.png')} />
            {/* <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.transitScreen.path} text={i18n.t('home.buttons.transits.title')} subtitle={i18n.t('home.buttons.transits.subtitle')} icon={require('../../assets/icons/FiTransit.png')} /> */}
            <BigButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.solarWeather.path} text={i18n.t('home.buttons.solar_weather.title')} subtitle={i18n.t('home.buttons.solar_weather.subtitle')} icon={require('../../assets/icons/SolarWind.png')} />
          </View>
        </View>
        <View style={homeStyles.nasaTools}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.other_tools.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.other_tools.subtitle')}</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.apod.path} text={i18n.t('home.buttons.apod.title')} subtitle={i18n.t('home.buttons.apod.subtitle')} image={require('../../assets/images/tools/apod.png')} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.skymapgenerator.path} text={i18n.t('home.buttons.skymap_generator.title')} subtitle={i18n.t('home.buttons.skymap_generator.subtitle')} image={require('../../assets/images/tools/skymap.png')} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.satelliteTracker.path} text={i18n.t('home.buttons.satellite_tracker.title')} subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')} image={require('../../assets/images/tools/satellite.png')} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
