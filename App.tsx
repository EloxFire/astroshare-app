import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { loadingSplashStyles } from "./src/styles/screens/loadingSplash";
import { StatusBar } from "expo-status-bar";
import useFonts from "./src/hooks/useFonts";
import Home from "./src/screens/Home";
import Compass from "./src/screens/Compass";
import Settings from "./src/screens/Settings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppSettingsProvider, useSettings } from "./src/contexts/AppSettingsContext";
import { globalStyles } from "./src/styles/global";
import { app_colors } from "./src/helpers/constants";

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
        <StatusBar animated style="light"/>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CompassScreen" component={Compass} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppSettingsProvider>
  );
}