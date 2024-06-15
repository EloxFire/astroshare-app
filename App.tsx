import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from "react";
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
import ComingSoon from "./src/screens/ComingSoon";
import About from "./src/screens/About";
import ObjectDetails from "./src/screens/ObjectDetails";
import Apod from "./src/screens/Apod";
import MoonPhases from "./src/screens/MoonPhases";
import ViewPointsManager from "./src/screens/ViewPointsManager";
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import SolarWeather from "./src/screens/SolarWeather";
import ScopeAlignment from "./src/screens/ScopeAlignment";
import 'dayjs/locale/fr'

dayjs.locale('fr');
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(relativeTime)
dayjs.tz.setDefault('Europe/Paris');
dayjs().format('L LT')



const Stack = createNativeStackNavigator();

export default function App({ navigation }: any) {
  const [appIsReady, setAppIsReady] = useState(false);

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

  if (!appIsReady) {
    return (
      <View style={loadingSplashStyles.container}>
        <Text style={loadingSplashStyles.container.text}>Chargement...</Text>
      </View>);
  }

  return (
    <RootSiblingParent>
      <AppSettingsProvider>
        <ObservationSpotProvider>
          <NavigationContainer>
            <StatusBar animated style="light" translucent />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name={routes.home.path} component={Home} />
              <Stack.Screen name={routes.objectDetails.path} component={ObjectDetails} />
              <Stack.Screen name={routes.scopeAlignment.path} component={ScopeAlignment} />
              <Stack.Screen name={routes.weather.path} component={Weather} />
              <Stack.Screen name={routes.moonPhases.path} component={MoonPhases} />
              <Stack.Screen name={routes.solarWeather.path} component={SolarWeather} />
              <Stack.Screen name={routes.apod.path} component={Apod} />
              <Stack.Screen name={routes.settings.path} component={Settings} />
              <Stack.Screen name={routes.favoritesViewPoints.path} component={ViewPointsManager} />
              <Stack.Screen name={routes.about.path} component={About} />
            </Stack.Navigator>
          </NavigationContainer>
        </ObservationSpotProvider>
      </AppSettingsProvider>
    </RootSiblingParent>
  );
}