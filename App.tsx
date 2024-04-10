import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { loadingSplashStyles } from "./src/styles/screens/loadingSplash";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "./src/contexts/AppSettingsContext";
import useFonts from "./src/hooks/useFonts";
import Home from "./src/screens/Home";
import Compass from "./src/screens/Compass";
import Settings from "./src/screens/Settings";
import Weather from "./src/screens/Weather";
import dayjs from "dayjs";

import 'dayjs/locale/fr';
import { routes } from "./src/helpers/routes";
dayjs.locale('fr');

const Stack = createNativeStackNavigator();

export default function App() {
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
    <AppSettingsProvider>
      <NavigationContainer>
        <StatusBar animated style="light" translucent/>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={routes.home} component={Home} />
          <Stack.Screen name={routes.compass} component={Compass} />
          <Stack.Screen name={routes.weather} component={Weather} />
          <Stack.Screen name={routes.moonPhases} component={Home} />
          <Stack.Screen name={routes.settings} component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppSettingsProvider>
  );
}