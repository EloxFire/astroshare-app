import 'react-native-get-random-values';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useEffect, useRef, useState} from "react";
import { Text, TextInput, View } from "react-native";
import { loadingSplashStyles } from "./src/styles/screens/loadingSplash";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "./src/contexts/AppSettingsContext";
import { routes } from "./src/helpers/routes";
import { RootSiblingParent } from 'react-native-root-siblings';
import { ObservationSpotProvider } from "./src/contexts/ObservationSpotContext";
import useFonts from "./src/hooks/useFonts";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import Weather from "./src/screens/Weather";
import dayjs from "dayjs";
import About from "./src/screens/About";
import Apod from "./src/screens/Apod";
import MoonPhases from "./src/screens/MoonPhases";
import ViewPointsManager from "./src/screens/ViewPointsManager";
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Calendar from 'dayjs/plugin/calendar'
import Duration from 'dayjs/plugin/duration'
import SolarWeather from "./src/screens/SolarWeather";
import ScopeAlignment from "./src/screens/ScopeAlignment";
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import Onboarding from "./src/screens/Onboarding";
import SatelliteTracker from "./src/screens/satelliteTracker/SatelliteTracker";
import SkyMapGenerator from "./src/screens/skymap/SkyMapGenerator";
import FavouritesScreen from "./src/screens/FavouritesScreen";
import { SolarSystemProvider } from "./src/contexts/SolarSystemContext";
import TutorialScreen from "./src/screens/TutorialScreen";
import { TranslationProvider } from "./src/hooks/useTranslation";
import './src/helpers/scripts/i18n/index';
import LanguageSelection from "./src/screens/LanguageSelection";
import SellScreen from "./src/screens/pro/SellScreen";
import TransitsScreen from "./src/screens/transits/TransitsScreen";
import AstroDataInfos from "./src/screens/AstroDataInfos";
import WidgetManager from "./src/screens/WidgetManager";
import { SpaceXContextProvider } from "./src/contexts/SpaceXContext";
import ChangelogScreen from "./src/screens/settings/Changelog";
import LaunchesScreen from "./src/screens/launches/Launches";
import { LaunchDataContextProvider } from "./src/contexts/LaunchContext";
import LaunchDetails from "./src/screens/launches/LaunchDetails";
import SkyMapSelection from "./src/screens/skymap/SkyMapSelection";
import Planetarium from "./src/screens/skymap/Planetarium";
import { StarsContextProvider } from "./src/contexts/StarsContext";
import {usePushNotifications} from "./src/hooks/usePushNotifications";
import ObservationPlannerScreen from "./src/screens/observationPlanner/ObservationPlannerScreen";
import {AuthContextProvider} from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ProfileScreen from "./src/screens/auth/Profile";
import PlanetaryConjunctionScreen from "./src/screens/transits/PlanetaryConjunctionScreen";
import PaywallScreen from "./src/screens/pro/PaywallScreen";
import CelestialBodyOverview from "./src/screens/celestialBodies/CelestialBodyOverview";
import {app_colors} from "./src/helpers/constants";
import * as SystemUI from 'expo-system-ui';
import CalculationHome from "./src/screens/calculations/CalculationHome";
import {SolarEclipsesScreen} from "./src/screens/transits/SolarEclipsesScreen";
import SolarEclipseDetails from "./src/screens/transits/SolarEclipseDetails";
import LunarEclipsesScreen from "./src/screens/transits/LunarEclipsesScreen";
import LunarEclipseDetails from "./src/screens/transits/LunarEclipseDetails";
import './firebaseConfig';

import { LogBox } from 'react-native';
import {setupAnalytics} from "./src/helpers/scripts/analytics";
import NewsBannerManager from './src/screens/settings/NewsBannerManager';
import SatelliteTrackerDetails from './src/screens/satelliteTracker/SatelliteTrackerDetails';
import SatellitePasses from './src/screens/satelliteTracker/SatellitePasses';
import ConstellationMaps from './src/screens/skymap/ConstellationMaps';
import AddCustomSatellite from './src/screens/satelliteTracker/AddCustomSatellite';
import ResourcesHome from './src/screens/resources/ResourcesHome';
import CategoryScreen from './src/screens/resources/CategoryScreen';
import ResourceDetails from './src/screens/resources/ResourceDetails';
import { ClockHome } from './src/screens/clock/ClockHome';
import LightPollutionMap from './src/screens/lightpollution/Map';
import { DsoContextProvider } from './src/contexts/DSOContext';
import { ChecklistsHome } from './src/screens/checklists/ChecklistsHome';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { DashboardAchievementsScreen } from './src/screens/dashboard/DashboardAchievementsScreen';
import { DashboardMessierCatalogScreen } from './src/screens/dashboard/DashboardMessierCatalogScreen';
import { DashboardActivitiesScreen } from './src/screens/dashboard/DashboardActivitiesScreen';
import { DashboardAllStatsScreen } from './src/screens/dashboard/DashboardAllStatsScreen';
import { DashboardAchievementsWatcher } from './src/components/watchers/DashboardAchievementsWatcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { DetailedMoonMapScreen } from './src/screens/skymap/DetailedMoonMapScreen';

dayjs.locale('fr');
dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(relativeTime)
dayjs.extend(Calendar)
dayjs.tz.setDefault(dayjs.tz.guess());
dayjs().format('L LT')


const Stack = createNativeStackNavigator();

export default function App() {

  LogBox.ignoreLogs(['EXGL: gl.pixelStorei()'])

  // const {expoPushToken, notification} = usePushNotifications();

  // console.log('expoPushToken', expoPushToken?.data);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SystemUI.setBackgroundColorAsync(app_colors.black)
        await useFonts()
        console.log('[App init] App starting...');
        console.log('[App init] Loading fonts...');
        console.log('[App init] Set timezone to', dayjs.tz.guess());
              
      } catch (e) {
        console.warn('[App init] Something went wrong : ', e);
      } finally {
        console.log('[App init] App is ready');
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // SETUP ANALYTICS FOR TRACK EVENTS
  useEffect(() => {
    setupAnalytics().then(() => {
      console.log('[Analytics] Analytics setup completed');
    })
  })


  // DEBUG ONLY : FLUSH LOCAL STORAGE
  // useEffect(() => {
  //   AsyncStorage.clear()
  // }, [])

  if (!appIsReady) {
    return (
      <View style={loadingSplashStyles.container}>
        <Text style={loadingSplashStyles.container.text}>Chargement...</Text>
      </View>);
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <TranslationProvider>
          <AuthContextProvider>
            <AppSettingsProvider>
                <ObservationSpotProvider>
                  <SolarSystemProvider>
                    <DsoContextProvider>
                      <StarsContextProvider>
                        <SpaceXContextProvider>
                          <LaunchDataContextProvider>
                              <DashboardAchievementsWatcher />
                              <StatusBar animated style="light" translucent />

                              <Stack.Navigator screenOptions={{ headerShown: false }}>
                                {/*ONBOARDING*/}
                                <Stack.Screen name={routes.onboarding.path} component={Onboarding} />
                                <Stack.Screen name={routes.settings.tutorial.path} component={TutorialScreen} />

                                {/*APP SCREENS*/}
                                <Stack.Screen name={routes.home.path} component={Home} />
                                <Stack.Screen name={routes.celestialBodies.details.path} component={CelestialBodyOverview} />
                                <Stack.Screen name={routes.favorites.path} component={FavouritesScreen} />
                                <Stack.Screen name={routes.scopeAlignment.path} component={ScopeAlignment} />
                                <Stack.Screen name={routes.weather.path} component={Weather} />
                                <Stack.Screen name={routes.moonPhases.path} component={MoonPhases} />
                                <Stack.Screen name={routes.solarWeather.path} component={SolarWeather} />
                                <Stack.Screen name={routes.apod.path} component={Apod} />
                                <Stack.Screen name={routes.calculations.home.path} component={CalculationHome} />
                                <Stack.Screen name={routes.checklistManager.home.path} component={ChecklistsHome} />
                                <Stack.Screen name={routes.dashboard.home.path} component={DashboardScreen} />
                                <Stack.Screen name={routes.dashboard.achievements.path} component={DashboardAchievementsScreen} />
                                <Stack.Screen name={routes.dashboard.activities.path} component={DashboardActivitiesScreen} />
                                <Stack.Screen name={routes.dashboard.messier.path} component={DashboardMessierCatalogScreen} />
                                <Stack.Screen name={routes.dashboard.stats.path} component={DashboardAllStatsScreen} />

                                {/*TRANSITS SCREENS*/}
                                <Stack.Screen name={routes.transits.home.path} component={TransitsScreen} />
                                <Stack.Screen name={routes.transits.planetary.path} component={PlanetaryConjunctionScreen} />
                                <Stack.Screen name={routes.transits.eclipses.solar.path} component={SolarEclipsesScreen} />
                                <Stack.Screen name={routes.transits.eclipses.solarDetails.path} component={SolarEclipseDetails} />
                                <Stack.Screen name={routes.transits.eclipses.lunar.path} component={LunarEclipsesScreen} />
                                <Stack.Screen name={routes.transits.eclipses.lunarDetails.path} component={LunarEclipseDetails} />

                                {/*SETTINGS SCREENS*/}
                                <Stack.Screen name={routes.settings.home.path} component={Settings} />
                                <Stack.Screen name={routes.settings.language.path} component={LanguageSelection} />
                                <Stack.Screen name={routes.settings.changelogScreen.path} component={ChangelogScreen} />
                                <Stack.Screen name={routes.settings.astroDataInfos.path} component={AstroDataInfos} />
                                <Stack.Screen name={routes.settings.widgetsManager.path} component={WidgetManager} />
                                <Stack.Screen name={routes.settings.newsManager.home.path} component={NewsBannerManager} />
                                <Stack.Screen name={routes.settings.favoritesViewPoints.path} component={ViewPointsManager} />
                                <Stack.Screen name={routes.settings.about.path} component={About} />

                                {/*MARKETING SCREENS*/}
                                <Stack.Screen name={routes.sellScreen.path} component={SellScreen} />
                                <Stack.Screen name={routes.pro.paywallScreen.path} component={PaywallScreen} />

                                {/*SATELLITE TRACKING SCREENS*/}
                                <Stack.Screen name={routes.satelliteTracker.path} component={SatelliteTracker} />
                                <Stack.Screen name={routes.satellitesTrackers.details.path} component={SatelliteTrackerDetails} />
                                <Stack.Screen name={routes.satellitesTrackers.satellitePasses.path} component={SatellitePasses} />
                                <Stack.Screen name={routes.satellitesTrackers.addCustomSatellite.path} component={AddCustomSatellite} />

                                {/*MAP SCREENS*/}
                                <Stack.Screen name={routes.skymaps.home.path} component={SkyMapSelection} />
                                <Stack.Screen name={routes.skymaps.planetarium.path} component={Planetarium} />
                                <Stack.Screen name={routes.skymaps.flatmap.path} component={SkyMapGenerator} />
                                <Stack.Screen name={routes.skymaps.constellations.path} component={ConstellationMaps} />
                                <Stack.Screen name={routes.skymaps.moon.path} component={DetailedMoonMapScreen} />

                                {/*PLANIFICATEUR*/}
                                <Stack.Screen name={routes.observationPlanner.path} component={ObservationPlannerScreen} />

                                {/* LIGHT POLLUTION SCREENS */}
                                <Stack.Screen name={routes.lightpollution.home.path} component={LightPollutionMap} />

                                {/* CLOCK SCREENS */}
                                <Stack.Screen name={routes.clock.home.path} component={ClockHome} />

                                {/*ROCKET LAUNCHES SCREENS*/}
                                <Stack.Screen name={routes.launchesScreen.path} component={LaunchesScreen} />
                                <Stack.Screen name={routes.launchDetails.path} component={LaunchDetails} />

                                {/*RESSOURCES RELATED SCREENS*/}
                                <Stack.Screen name={routes.resources.home.path} component={ResourcesHome} />
                                <Stack.Screen name={routes.resources.categoryScreen.path} component={CategoryScreen} />
                                <Stack.Screen name={routes.resources.details.path} component={ResourceDetails} />

                                {/*AUTH SCREENS*/}
                                <Stack.Screen name={routes.auth.login.path} component={LoginScreen} />
                                <Stack.Screen name={routes.auth.register.path} component={RegisterScreen} />
                                <Stack.Screen name={routes.auth.profile.path} component={ProfileScreen} />
                                <Stack.Screen name={routes.auth.forgotPassword.path} component={ForgotPasswordScreen} />
                              </Stack.Navigator>
                          </LaunchDataContextProvider>
                        </SpaceXContextProvider>
                      </StarsContextProvider>
                    </DsoContextProvider>
                  </SolarSystemProvider>
                </ObservationSpotProvider>
            </AppSettingsProvider>
          </AuthContextProvider>
        </TranslationProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );
}
