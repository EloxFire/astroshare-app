import '../src/i18n';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { House, Settings, Search, Telescope, LayoutGrid } from 'lucide-react-native';
import { app_colors } from '../src/helpers/variables';
import { queryClient } from '../src/helpers/queryClient';
import { PlatformPressable } from 'expo-router/build/react-navigation';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { useI18nReady } from '../src/i18n/useI18nReady';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { GPS_POSITION_QUERY_KEY, fetchGpsPosition } from '../src/hooks/useCurrentGpsPosition';

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const i18nReady = useI18nReady();
  const { t } = useTranslation();

  // Précharge la position GPS dès le démarrage, uniquement si l'app est en mode "position
  // actuelle" (pas d'observatoire actif) — sinon on demanderait la permission de localisation
  // inutilement à un utilisateur qui a choisi un observatoire enregistré. Le cache (queryKey
  // partagée, voir useCurrentGpsPosition.ts) profite ensuite à tous les écrans qui en ont
  // besoin : plus de temps d'attente au moment de la navigation.
  useEffect(() => {
    queryClient.query({ queryKey: GPS_POSITION_QUERY_KEY, queryFn: fetchGpsPosition, staleTime: 5 * 60 * 1000 }); // 5 minutes
  }, []);

  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Tabs screenOptions={{
        tabBarActiveTintColor: app_colors.accent.main,
        headerShown: false,
        tabBarStyle: {
          height: 60,
        },
        }}
        backBehavior='order'
      >
        <Tabs.Screen name="(home)" options={{
          // Remove android ripple effect on tab press
          headerPressColor: 'transparent',
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
          popToTopOnBlur: true,
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="explore" options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ color, size }) => (
            <Telescope color={color} size={size} />
          ),
          popToTopOnBlur: true,
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          )
        }} />
        <Tabs.Screen name="search" options={{
          title: ' ',
          tabBarIcon: ({ size, focused }) => (
            <View
              style={{
                width: size + 35,
                height: size + 35,
                borderRadius: (size + 35) / 2,
                backgroundColor: focused ? app_colors.accent.main : app_colors.primary.main,
                alignItems: 'center',
                justifyContent: 'center',
                // Add glow effect when focused
                shadowColor: focused ? app_colors.accent.main : app_colors.primary.main,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: focused ? 0.7 : 0,
                shadowRadius: focused ? 10 : 0,
              }}
            >
              <Search color={app_colors.white} size={size} />
            </View>
          ),
          popToTopOnBlur: true,
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="tools" options={{
          title: t('tabs.tools'),
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid color={color} size={size} />
          ),
          popToTopOnBlur: true,
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="settings" options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
          popToTopOnBlur: true,
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="profile" options={{
          href: null, // hide from tab bar
        }} />
      </Tabs>
    </QueryClientProvider>
  );
}
