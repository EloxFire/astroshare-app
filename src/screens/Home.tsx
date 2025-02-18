import React, { useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import {app_colors, storageKeys} from '../helpers/constants';
import { useSettings } from '../contexts/AppSettingsContext';
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch';
import { i18n } from '../helpers/scripts/i18n';
import { useLaunchData } from '../contexts/LaunchContext';
import LocationHeader from '../components/LocationHeader';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/buttons/BigButton';
import BannerHandler from '../components/banners/BannerHandler';
import ToolButton from '../components/commons/buttons/ToolButton';
import HomeSearchModule from '../components/forms/HomeSearchModule';
import HomeWidgetDisplay from '../components/widgets/HomeWidgetDisplay';
import {getData} from "../helpers/storage";
import {useRessources} from "../contexts/RessourcesContext";

export default function Home({ navigation }: any) {
  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { launchContextLoading } = useLaunchData()
  const {ressourcesLoading} = useRessources()

  const [pushToken, setPushToken] = React.useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        navigation.push(routes.onboarding.path)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const token = await getData(storageKeys.pushToken);
      if(!token) return;
      setPushToken(token)
    })()
  }, [])

  return (
    <View style={globalStyles.body}>
      <AppHeader navigation={navigation} />
      <BannerHandler />
      <LocationHeader />
      <HomeSearchModule navigation={navigation} />
      <ScrollView style={{ borderTopWidth: 1, borderTopColor: app_colors.white_twenty }}>
        <HomeWidgetDisplay />
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.tools.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.tools.subtitle')}</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            {/*<BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.observationPlanner.path} text={i18n.t('home.buttons.observationPlanner.title')} subtitle={i18n.t('home.buttons.observationPlanner.subtitle')} icon={require('../../assets/icons/FiCalendar.png')} />*/}
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.weather.path} text={i18n.t('home.buttons.weather.title')} subtitle={i18n.t('home.buttons.weather.subtitle')} icon={require('../../assets/icons/FiSun.png')} />
            <BigButton disabled={!currentUserLocation} navigation={navigation} targetScreen={routes.scopeAlignment.path} text={i18n.t('home.buttons.scope_alignment.title')} subtitle={i18n.t('home.buttons.scope_alignment.subtitle')} icon={require('../../assets/icons/FiCompass.png')} />
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.moonPhases.path} text={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} icon={require('../../assets/icons/FiMoon.png')} />
            <BigButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.solarWeather.path} text={i18n.t('home.buttons.solar_weather.title')} subtitle={i18n.t('home.buttons.solar_weather.subtitle')} icon={require('../../assets/icons/SolarWind.png')} />
            <BigButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.transits.home.path} text={i18n.t('home.buttons.transits.title')} subtitle={i18n.t('home.buttons.transits.subtitle')} icon={require('../../assets/icons/FiTransit.png')} />
            <BigButton isPremium navigation={navigation} targetScreen={routes.calculations.home.path} text={i18n.t('home.buttons.calculations.title')} subtitle={i18n.t('home.buttons.calculations.subtitle')} icon={require('../../assets/icons/FiCpu.png')} />
          </View>
        </View>
        <View style={[homeStyles.nasaTools, {marginBottom: 0}]}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.ressources.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.ressources.subtitle')}</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection || ressourcesLoading} navigation={navigation} targetScreen={routes.ressources.path} text={i18n.t('home.buttons.ressources.title')} subtitle={i18n.t('home.buttons.ressources.subtitle')} image={require('../../assets/images/tools/ressources.png')} />
          </View>
        </View>
        <View style={homeStyles.nasaTools}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.other_tools.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.other_tools.subtitle')}</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.apod.path} text={i18n.t('home.buttons.apod.title')} subtitle={i18n.t('home.buttons.apod.subtitle')} image={require('../../assets/images/tools/apod.png')} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.skymapSelection.path} text={i18n.t('home.buttons.skymap_generator.title')} subtitle={i18n.t('home.buttons.skymap_generator.subtitle')} image={require('../../assets/images/tools/skymap.png')} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.satelliteTracker.path} text={i18n.t('home.buttons.satellite_tracker.title')} subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')} image={require('../../assets/images/tools/satellite.png')} />
            <ToolButton disabled={!hasInternetConnection || launchContextLoading} navigation={navigation} targetScreen={routes.launchesScreen.path} text={i18n.t('home.buttons.launches_screen.title')} subtitle={i18n.t('home.buttons.launches_screen.subtitle')} image={require('../../assets/images/tools/launches.png')} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
