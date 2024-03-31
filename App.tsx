import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./src/screens/Home";
import { useEffect, useState } from "react";
import useFonts from "./src/hooks/useFonts";
import { Text, View } from "react-native";
import { app_colors } from "./src/helpers/constants";
import { loadingSplashStyles } from "./src/styles/screens/loadingSplash";

const Stack = createNativeStackNavigator();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await useFonts()
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={loadingSplashStyles.container}>
        <Text style={{ color: app_colors.white }}>Chargement...</Text>
      </View>);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}