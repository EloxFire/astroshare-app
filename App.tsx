import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { loadingSplashStyles } from "./src/styles/screens/loadingSplash";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "./src/contexts/AppSettingsContext";
import { routes } from "./src/helpers/routes";
import { RootSiblingParent } from 'react-native-root-siblings';
import { ObservationSpotProvider } from "./src/contexts/ObservationSpotContext";
import useFonts from "./src/hooks/useFonts";
import Home from "./src/screens/Home";
import Compass from "./src/screens/Compass";
import Settings from "./src/screens/Settings";
import Weather from "./src/screens/Weather";
import dayjs from "dayjs";
import ComingSoon from "./src/screens/ComingSoon";
import About from "./src/screens/About";
import ObjectDetails from "./src/screens/ObjectDetails";
import Apod from "./src/screens/Apod";
import MoonPhases from "./src/screens/MoonPhases";
import 'dayjs/locale/fr';
import ViewPointsManager from "./src/screens/ViewPointsManager";
dayjs.locale('fr');


const Stack = createNativeStackNavigator();

export default function App({ navigation}: any) {
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
            <StatusBar animated style="light" translucent/>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name={routes.home} component={Home} />
              <Stack.Screen name={routes.objectDetails} component={ObjectDetails} />
              <Stack.Screen name={routes.compass} component={Compass} />
              <Stack.Screen name={routes.weather} component={Weather} />
              <Stack.Screen name={routes.moonPhases} component={MoonPhases}/>
              <Stack.Screen name={routes.solarWeather} component={ComingSoon}
                initialParams={{ pageTitle: 'Météo solaire et aurores', pageSubtitle: '// La météo de notre étoile', disclaimer: '// Cette fonctionnalité sera bientôt disponible dans votre application Astroshare. Vous pourrez ici consulter les dernières informations sur le vent solaire les EMC et toutes les prévisions d\'aurores boréales.' }}
              />
              <Stack.Screen name={routes.apod} component={Apod} />
              <Stack.Screen name={routes.settings} component={Settings} />
              <Stack.Screen name={routes.favoritesViewPoints} component={ViewPointsManager} />
              <Stack.Screen name={routes.about} component={About} />
            </Stack.Navigator>
          </NavigationContainer>
        </ObservationSpotProvider>
      </AppSettingsProvider>
    </RootSiblingParent>
  );
}