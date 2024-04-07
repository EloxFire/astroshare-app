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
          <Stack.Screen name="WeatherScreen" component={Weather} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppSettingsProvider>
  );
}