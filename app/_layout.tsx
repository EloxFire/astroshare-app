import '../src/i18n';
import { Tabs, useSegments } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { House, Settings, Search, Telescope, LayoutGrid } from 'lucide-react-native';
import { app_colors } from '../src/helpers/variables';
import { PlatformPressable } from 'expo-router/build/react-navigation';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { useI18nReady } from '../src/i18n/useI18nReady';
import { useTranslation } from 'react-i18next';
import { GpsLocationProvider } from '../src/context/GpsContext';
import { AuthContextProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const i18nReady = useI18nReady();
  const { t } = useTranslation();
  const segments = useSegments();

  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  // Chaque onglet principal est son propre Stack imbriqué (voir ex: app/settings/_layout.tsx) :
  // segments ne contient que le nom de l'onglet (ex: ["settings"]) quand on est sur son écran
  // racine (index.tsx) ; toute navigation dans son Stack ajoute un segment de plus (ex:
  // ["settings", "observatories"]), peu importe la profondeur ensuite. useSegments() est
  // réactif : ce composant se re-rend à chaque changement de route, recalculant tabBarStyle.
  const isTabRootScreen = segments.length <= 1;

  return (
    <AuthContextProvider>
      <GpsLocationProvider>
        {/* <Toast /> */}
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: app_colors.accent.main,
            headerShown: false,
            tabBarStyle: isTabRootScreen ? { height: 60 } : { display: 'none' },
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
            // Masque aussi la tabbar elle-même tant qu'on est dans ce groupe : comme tout
            // profile/* est un seul écran Tabs (grâce au Stack imbriqué dans
            // app/profile/_layout.tsx), ça couvre toutes les sous-routes sans avoir à le répéter.
            tabBarStyle: { display: "none" },
          }} />
          <Tabs.Screen name="auth" options={{
            href: null, // hide from tab bar
            // Masque aussi la tabbar elle-même tant qu'on est dans ce groupe : comme tout
            // auth/* est un seul écran Tabs (grâce au Stack imbriqué dans app/auth/_layout.tsx),
            // ça couvre toutes les sous-routes (login, index, etc.) sans avoir à le répéter.
            tabBarStyle: { display: "none" },
          }} />
        </Tabs>
      </GpsLocationProvider>
    </AuthContextProvider>
  );
}
