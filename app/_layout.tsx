import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Compass, House, NotebookPen, Settings } from 'lucide-react-native';
import { app_colors } from '../src/helpers/colors';

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Tabs screenOptions={{tabBarActiveTintColor: app_colors.accent}}>
        <Tabs.Screen name="index" options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          )
        }} />
        <Tabs.Screen name="explore" options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          )
        }} />
        <Tabs.Screen name="journal" options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <NotebookPen color={color} size={size} />
          )
        }} />
        <Tabs.Screen name="settings" options={{
          title: 'Réglages',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          )
        }} />
      </Tabs>
    </React.Fragment>
  );
}
