import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import {app_colors, storageKeys} from '../helpers/constants';
import { useSettings } from '../contexts/AppSettingsContext';
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch';
import { i18n } from '../helpers/scripts/i18n';
import { useLaunchData } from '../contexts/LaunchContext';
import {getData} from "../helpers/storage";
import {sendAnalyticsEvent} from "../helpers/scripts/analytics";
import {eventTypes} from "../helpers/constants/analytics";
import {useAuth} from "../contexts/AuthContext";
import {useTranslation} from "../hooks/useTranslation";
import { checkAppUpdate } from '../helpers/scripts/utils/checkAppUpdate';
import { isProUser, isSevunUser } from '../helpers/scripts/auth/checkUserRole';
import LocationHeader from '../components/LocationHeader';
import AppHeader from '../components/commons/AppHeader';
import BannerHandler from '../components/banners/BannerHandler';
import ToolButton from '../components/commons/buttons/ToolButton';
import HomeSearchModule from '../components/forms/HomeSearchModule';
import HomeWidgetDisplay from '../components/widgets/HomeWidgetDisplay';
import NewsBannerHandler from "../components/banners/NewsBannerHandler";
import AppUpdateModal from '../components/modals/AppUpdateModal';
import SevunCard from '../components/home/SevunCard';
import { useDsoCatalog } from '../contexts/DSOContext';
import { useStarCatalog } from '../contexts/StarsContext';

export default function Home({ navigation }: any) {
  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { launchContextLoading } = useLaunchData()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { homeNewsBannerVisible } = useSettings()
  const { dsoCatalogLoading } = useDsoCatalog();
  const { starsCatalogLoading } = useStarCatalog();

  const [pushToken, setPushToken] = React.useState<string | null>(null)
  const [appUpdateModalVisible, setAppUpdateModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        navigation.replace(routes.onboarding.path)
      }else{
        sendAnalyticsEvent(currentUser, currentUserLocation, 'Home screen view', eventTypes.SCREEN_VIEW, {firstLaunch: firstLaunch}, currentLocale)
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

  useEffect(() => {
    checkAppUpdate().then((updateAvailable) => {
      if (updateAvailable) {
        console.log('[App Update Check] New version available');
        setAppUpdateModalVisible(true);
      } else {
        console.log('[App Update Check] App is up to date');
        setAppUpdateModalVisible(false);
      }
    })
  }, [])

  const onAppUpdateModalClose = () => {
    setAppUpdateModalVisible(false);
  }

  return (
    <View style={globalStyles.body}>
      <AppUpdateModal isVisible={appUpdateModalVisible} onClose={onAppUpdateModalClose} />
      <AppHeader navigation={navigation} />
      <BannerHandler />
        {homeNewsBannerVisible && <NewsBannerHandler navigation={navigation} />}
      <LocationHeader />
      <HomeSearchModule navigation={navigation} />
      <ScrollView style={{ borderTopWidth: 0.5, borderTopColor: app_colors.white_twenty }}>
        <HomeWidgetDisplay />
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.prepare.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.prepare.subtitle')}</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.weather.path} text={i18n.t('home.buttons.weather.title')} subtitle={i18n.t('home.buttons.weather.subtitle')} icon={require('../../assets/icons/FiCloudLightning.png')} image={require('../../assets/images/tools/weather.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_weather_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton isPremium={!isProUser(currentUser)} disabled={!hasInternetConnection || !isProUser(currentUser)} navigation={navigation} targetScreen={routes.lightpollution.home.path} text={i18n.t('home.buttons.lightpollution.title')} subtitle={i18n.t('home.buttons.lightpollution.subtitle')} image={require('../../assets/images/tools/lightpollutionmap.png')} icon={require('../../assets/icons/FiSun.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_light_pollution_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.moonPhases.path} text={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} icon={require('../../assets/icons/FiMoon.png')} image={require('../../assets/images/tools/moonphases.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_moon_phases_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.transits.home.path} text={i18n.t('home.buttons.transits.title')} subtitle={i18n.t('home.buttons.transits.subtitle')} icon={require('../../assets/icons/FiTransit.png')} image={require('../../assets/images/tools/solareclipse.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_transits_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation || dsoCatalogLoading || starsCatalogLoading} navigation={navigation} targetScreen={routes.observationPlanner.path} text={i18n.t('home.buttons.observationPlanner.title')} subtitle={i18n.t('home.buttons.observationPlanner.subtitle')} icon={require('../../assets/icons/FiCalendar.png')} image={require('../../assets/images/tools/observationplanner.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_observation_planner_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton navigation={navigation} targetScreen={routes.checklistManager.home.path} text={i18n.t('home.buttons.checklist_manager.title')} subtitle={i18n.t('home.buttons.checklist_manager.subtitle')} icon={require('../../assets/icons/FiFileText.png')} image={require('../../assets/images/tools/checklists.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_checklist_manager_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
          </View>
        </View>
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.outdoor.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.outdoor.subtitle')}</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <ToolButton disabled={!currentUserLocation} navigation={navigation} targetScreen={routes.scopeAlignment.path} text={i18n.t('home.buttons.scope_alignment.title')} subtitle={i18n.t('home.buttons.scope_alignment.subtitle')} icon={require('../../assets/icons/FiCompass.png')} image={require('../../assets/images/tools/polaralign.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_scope_alignment_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.clock.home.path} text={i18n.t('home.buttons.clock.title')} subtitle={i18n.t('home.buttons.clock.subtitle')} icon={require('../../assets/icons/FiClock.png')} image={require('../../assets/images/tools/timezones.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_clock_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.solarWeather.path} text={i18n.t('home.buttons.solar_weather.title')} subtitle={i18n.t('home.buttons.solar_weather.subtitle')} icon={require('../../assets/icons/SolarWind.png')} image={require('../../assets/images/tools/solarweather.jpg')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_solar_weather_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || !currentUserLocation} navigation={navigation} targetScreen={routes.skymaps.home.path} text={i18n.t('home.buttons.skymap_generator.title')} subtitle={i18n.t('home.buttons.skymap_generator.subtitle')} image={require('../../assets/images/tools/skymap.png')} icon={require('../../assets/icons/FiMap.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_skymap_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton navigation={navigation} targetScreen={routes.calculations.home.path} text={i18n.t('home.buttons.calculations.title')} subtitle={i18n.t('home.buttons.calculations.subtitle')} icon={require('../../assets/icons/FiCpu.png')} image={require('../../assets/images/tools/calculator.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_calculations_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton navigation={navigation} targetScreen={routes.telescopeSimulator.home.path} text={i18n.t('home.buttons.telescope_simulator.title')} subtitle={i18n.t('home.buttons.telescope_simulator.subtitle')} icon={require('../../assets/icons/FiTelescope.png')} image={require('../../assets/images/tools/skymap.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_telescope_simulator_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
          </View>
        </View>
        {
          !isProUser(currentUser) &&
          <View style={homeStyles.proSection}>
            <Text style={globalStyles.sections.title}>{i18n.t('home.pro_section.title')}</Text>
            <Text style={globalStyles.sections.subtitle}>{i18n.t('home.pro_section.subtitle')}</Text>
            <View style={homeStyles.nasaTools.buttons}>
              <ToolButton image={require('../../assets/images/tools/apod.png')} isPremium navigation={navigation} targetScreen={routes.sellScreen.path} text={i18n.t('settings.buttons.pro.title')} subtitle={i18n.t('settings.buttons.pro.subtitle')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_pro_upgrade_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            </View>
          </View>
        }
        <View style={homeStyles.nasaTools}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.other_tools.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.other_tools.subtitle')}</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.dashboard.home.path} text={i18n.t('home.buttons.dashboard.title')} subtitle={i18n.t('home.buttons.dashboard.subtitle')} image={require('../../assets/images/tools/observationjournal.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_dashboard_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.satelliteTracker.path} text={i18n.t('home.buttons.satellite_tracker.title')} subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')} image={require('../../assets/images/tools/satellite.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_satellite_tracker_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection || launchContextLoading} navigation={navigation} targetScreen={routes.launchesScreen.path} text={i18n.t('home.buttons.launches_screen.title')} subtitle={i18n.t('home.buttons.launches_screen.subtitle')} image={require('../../assets/images/tools/launches.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_launches_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.apod.path} text={i18n.t('home.buttons.apod.title')} subtitle={i18n.t('home.buttons.apod.subtitle')} image={require('../../assets/images/tools/apod.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_apod_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
          </View>
        </View>
        <View style={[homeStyles.nasaTools, { marginBottom: 80 }]}>
          <Text style={globalStyles.sections.title}>{i18n.t('home.resources.title')}</Text>
          <Text style={globalStyles.sections.subtitle}>{i18n.t('home.resources.subtitle')}</Text>
          <View style={homeStyles.nasaTools.buttons}>
            <ToolButton disabled={!hasInternetConnection} navigation={navigation} targetScreen={routes.resources.home.path} text={i18n.t('home.buttons.resources.title')} subtitle={i18n.t('home.buttons.resources.subtitle')} image={require('../../assets/images/tools/resources.png')} onPress={() => sendAnalyticsEvent(currentUser, currentUserLocation, 'home_resources_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)} />
            {isSevunUser(currentUser) && (
              <SevunCard
                onPress={() => {
                  sendAnalyticsEvent(currentUser, currentUserLocation, 'home_sevun_card_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale);
                  navigation.navigate(routes.partners.sevun.home.path);
                }}
                />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
