import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Compass, House, NotebookPen, Settings, Search, X, Telescope, LayoutGrid } from 'lucide-react-native';
import { app_colors } from '../src/helpers/variables';
import { PlatformPressable } from 'expo-router/build/react-navigation';
import { useAppFonts } from '../src/hooks/useAppFonts';

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <React.Fragment>
      <StatusBar style="light" />
      <Tabs screenOptions={{
        tabBarActiveTintColor: app_colors.accent,
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
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="explore" options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => (
            <Telescope color={color} size={size} />
          ),
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
                backgroundColor: focused ? app_colors.accent : app_colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                // Add glow effect when focused
                shadowColor: focused ? app_colors.accent : app_colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: focused ? 0.7 : 0,
                shadowRadius: focused ? 10 : 0,
              }}
            >
              <Search color={app_colors.white} size={size} />
            </View>
          ),
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="tools" options={{
          title: 'Outils',
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid color={color} size={size} />
          ),
          tabBarButton: (props) => ( // this is what i added
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
            />
          ),
        }} />
        <Tabs.Screen name="settings" options={{
          title: 'Réglages',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
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
    </React.Fragment>
  );
}
