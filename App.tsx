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
import ObjectDetails from "./src/screens/ObjectDetails";
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
import PlanetDetails from "./src/screens/PlanetDetails";
import { SolarSystemProvider } from "./src/contexts/SolarSystemContext";
import BrightStarDetails from "./src/screens/BrightStarDetails";
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
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "./src/helpers/scripts/notifications/registerPushNotifications";
import {storeData} from "./src/helpers/storage";
import LaunchDetails from "./src/screens/launches/LaunchDetails";
import {storageKeys} from "./src/helpers/constants";
import SkyMapSelection from "./src/screens/skymap/SkyMapSelection";
import Planetarium from "./src/screens/skymap/Planetarium";
import { StarsContextProvider } from "./src/contexts/StarsContext";

dayjs.locale('fr');
dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(relativeTime)
dayjs.tz.setDefault('Europe/Paris');
dayjs().format('L LT')


const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    async function prepare() {
      try {
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

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));
  }, []);

  useEffect(() => {
    (async() => {
      if(expoPushToken !== '' && expoPushToken !== null && expoPushToken !== undefined) {
        await storeData(storageKeys.pushToken, expoPushToken)
        console.log('Token stored')
      }
    })()
  }, [expoPushToken])

  if (!appIsReady) {
    return (
      <View style={loadingSplashStyles.container}>
        <Text style={loadingSplashStyles.container.text}>Chargement...</Text>
      </View>);
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <AppSettingsProvider>
          <TranslationProvider>
            <ObservationSpotProvider>
              <SolarSystemProvider>
                <StarsContextProvider>
                  <SpaceXContextProvider>
                    <LaunchDataContextProvider>
                      <StatusBar animated style="light" translucent />
                      <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name={routes.onboarding.path} component={Onboarding} />
                        <Stack.Screen name={routes.tutorial.path} component={TutorialScreen} />
                        <Stack.Screen name={routes.home.path} component={Home} />
                        <Stack.Screen name={routes.objectDetails.path} component={ObjectDetails} />
                        <Stack.Screen name={routes.planetDetails.path} component={PlanetDetails} />
                        <Stack.Screen name={routes.brightStarDetails.path} component={BrightStarDetails} />
                        <Stack.Screen name={routes.scopeAlignment.path} component={ScopeAlignment} />
                        <Stack.Screen name={routes.weather.path} component={Weather} />
                        <Stack.Screen name={routes.moonPhases.path} component={MoonPhases} />
                        <Stack.Screen name={routes.solarWeather.path} component={SolarWeather} />
                        <Stack.Screen name={routes.apod.path} component={Apod} />
                        <Stack.Screen name={routes.settings.path} component={Settings} />
                        <Stack.Screen name={routes.favoritesViewPoints.path} component={ViewPointsManager} />
                        <Stack.Screen name={routes.about.path} component={About} />
                        <Stack.Screen name={routes.satelliteTracker.path} component={SatelliteTracker} />
                        <Stack.Screen name={routes.issTracker.path} component={IssTracker} />
                        <Stack.Screen name={routes.starlinkTracker.path} component={StarlinkTracker} />
                        <Stack.Screen name={routes.favorites.path} component={FavouritesScreen} />
                        <Stack.Screen name={routes.skymapSelection.path} component={SkyMapSelection} />
                        <Stack.Screen name={routes.planetarium.path} component={Planetarium} />
                        <Stack.Screen name={routes.flatSkymap.path} component={SkyMapGenerator} />
                        <Stack.Screen name={routes.language.path} component={LanguageSelection} />
                        <Stack.Screen name={routes.sellScreen.path} component={SellScreen} />
                        <Stack.Screen name={routes.transitScreen.path} component={TransitsScreen} />
                        <Stack.Screen name={routes.astroDataInfos.path} component={AstroDataInfos} />
                        <Stack.Screen name={routes.widgetsManager.path} component={WidgetManager} />
                        <Stack.Screen name={routes.changelogScreen.path} component={ChangelogScreen} />
                        <Stack.Screen name={routes.launchesScreen.path} component={LaunchesScreen} />
                        <Stack.Screen name={routes.launchDetails.path} component={LaunchDetails} />
                      </Stack.Navigator>
                    </LaunchDataContextProvider>
                  </SpaceXContextProvider>
                </StarsContextProvider>
              </SolarSystemProvider>
            </ObservationSpotProvider>
          </TranslationProvider>
        </AppSettingsProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );
}