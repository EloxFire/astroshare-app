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
import IssTracker from "./src/screens/satelliteTracker/IssTracker";
import StarlinkTracker from "./src/screens/satelliteTracker/StarlinkTracker";
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
import RessourcesScreen from "./src/screens/ressources/RessourcesScreen";
import {RessourcesContextProvider} from "./src/contexts/RessourcesContext";
import CategoryScreen from "./src/screens/ressources/CategoryScreen";
import RessourceScreen from "./src/screens/ressources/RessourceScreen";
import './firebaseConfig';
import {usePushNotifications} from "./src/hooks/usePushNotifications";
import ObservationPlannerScreen from "./src/screens/observationPlanner/ObservationPlannerScreen";
import {AuthContextProvider} from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ProfileScreen from "./src/screens/auth/Profile";
import PlanetaryConjunctionScreen from "./src/screens/transits/PlanetaryConjunctionScreen";
import IssPasses from "./src/screens/satelliteTracker/IssPasses";
import PaywallScreen from "./src/screens/pro/PaywallScreen";
import CelestialBodyOverview from "./src/screens/celestialBodies/CelestialBodyOverview";
import {app_colors} from "./src/helpers/constants";
import * as SystemUI from 'expo-system-ui';
import CalculationHome from "./src/screens/calculations/CalculationHome";
import SolarEclipsesScreen from "./src/screens/transits/SolarEclipsesScreen";
import SolarEclipseDetails from "./src/screens/transits/SolarEclipseDetails";
import LunarEclipsesScreen from "./src/screens/transits/LunarEclipsesScreen";
import LunarEclipseDetails from "./src/screens/transits/LunarEclipseDetails";

dayjs.locale('fr');
dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(relativeTime)
dayjs.tz.setDefault('Europe/Paris');
dayjs().format('L LT')


const Stack = createNativeStackNavigator();

export default function App() {
  const {expoPushToken, notification} = usePushNotifications();

  console.log('expoPushToken', expoPushToken?.data);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SystemUI.setBackgroundColorAsync(app_colors.black)
        await useFonts()
        console.log('Fonts loaded');
      } catch (e) {
        console.warn('Something went wrong : ', e);
      } finally {
        console.log('App is ready');
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  if (!appIsReady) {
    return (
      <View style={loadingSplashStyles.container}>
        <Text style={loadingSplashStyles.container.text}>Chargement...</Text>
      </View>);
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <AuthContextProvider>
          <AppSettingsProvider>
            <TranslationProvider>
              <ObservationSpotProvider>
                <SolarSystemProvider>
                  <StarsContextProvider>
                    <SpaceXContextProvider>
                      <LaunchDataContextProvider>
                        <RessourcesContextProvider>
                          <StatusBar animated style="light" translucent />
                          <Stack.Navigator screenOptions={{ headerShown: false }}>
                            {/*ONBOARDING*/}
                            <Stack.Screen name={routes.onboarding.path} component={Onboarding} />
                            <Stack.Screen name={routes.tutorial.path} component={TutorialScreen} />

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

                            {/*TRANSITS SCREENS*/}
                            <Stack.Screen name={routes.transits.home.path} component={TransitsScreen} />
                            <Stack.Screen name={routes.transits.planetary.path} component={PlanetaryConjunctionScreen} />
                            <Stack.Screen name={routes.transits.eclipses.solar.path} component={SolarEclipsesScreen} />
                            <Stack.Screen name={routes.transits.eclipses.solarDetails.path} component={SolarEclipseDetails} />
                            <Stack.Screen name={routes.transits.eclipses.lunar.path} component={LunarEclipsesScreen} />
                            <Stack.Screen name={routes.transits.eclipses.lunarDetails.path} component={LunarEclipseDetails} />

                            {/*SETTINGS SCREENS*/}
                            <Stack.Screen name={routes.settings.path} component={Settings} />
                            <Stack.Screen name={routes.language.path} component={LanguageSelection} />
                            <Stack.Screen name={routes.changelogScreen.path} component={ChangelogScreen} />
                            <Stack.Screen name={routes.astroDataInfos.path} component={AstroDataInfos} />
                            <Stack.Screen name={routes.widgetsManager.path} component={WidgetManager} />
                            <Stack.Screen name={routes.favoritesViewPoints.path} component={ViewPointsManager} />
                            <Stack.Screen name={routes.about.path} component={About} />

                            {/*MARKETING SCREENS*/}
                            <Stack.Screen name={routes.sellScreen.path} component={SellScreen} />
                            <Stack.Screen name={routes.pro.paywallScreen.path} component={PaywallScreen} />

                            {/*SATELLITE TRACKING SCREENS*/}
                            <Stack.Screen name={routes.satelliteTracker.path} component={SatelliteTracker} />
                            <Stack.Screen name={routes.issTracker.path} component={IssTracker} />
                            <Stack.Screen name={routes.starlinkTracker.path} component={StarlinkTracker} />
                            <Stack.Screen name={routes.satellitesTrackers.issPasses.path} component={IssPasses} />

                            {/*MAP SCREENS*/}
                            <Stack.Screen name={routes.skymapSelection.path} component={SkyMapSelection} />
                            <Stack.Screen name={routes.planetarium.path} component={Planetarium} />
                            <Stack.Screen name={routes.flatSkymap.path} component={SkyMapGenerator} />

                            {/*PLANIFICATEUR*/}
                            <Stack.Screen name={routes.observationPlanner.path} component={ObservationPlannerScreen} />

                            {/*ROCKET LAUNCHES SCREENS*/}
                            <Stack.Screen name={routes.launchesScreen.path} component={LaunchesScreen} />
                            <Stack.Screen name={routes.launchDetails.path} component={LaunchDetails} />

                            {/*RESSOURCES RELATED SCREENS*/}
                            <Stack.Screen name={routes.ressources.path} component={RessourcesScreen} />
                            <Stack.Screen name={routes.categoryScreen.path} component={CategoryScreen} />
                            <Stack.Screen name={routes.ressource.path} component={RessourceScreen} />

                            {/*AUTH SCREENS*/}
                            <Stack.Screen name={routes.auth.login.path} component={LoginScreen} />
                            <Stack.Screen name={routes.auth.register.path} component={RegisterScreen} />
                            <Stack.Screen name={routes.auth.profile.path} component={ProfileScreen} />
                          </Stack.Navigator>
                        </RessourcesContextProvider>
                      </LaunchDataContextProvider>
                    </SpaceXContextProvider>
                  </StarsContextProvider>
                </SolarSystemProvider>
              </ObservationSpotProvider>
            </TranslationProvider>
          </AppSettingsProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );
}