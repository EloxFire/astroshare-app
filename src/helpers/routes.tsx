import React from "react";
import { Astroid, User, LucideProps, Search, CalendarDays, Telescope } from 'lucide-react-native';
import { HomeScreen } from "../screens/Home/HomeScreen";
import { ProfileScreen } from "../screens/tabs/Profile/Profile";

export const app_routes: { [key: string]: { type: string; label: string; icon: React.ComponentType<LucideProps>; component: React.ComponentType<any> } } = {
  home: {
    type: 'tab',
    label: 'Accueil',
    icon: Astroid,
    component: HomeScreen
  },
  observe: {
    type: 'tab',
    label: 'Observer',
    icon: Telescope,
    component: HomeScreen
  },
  search: {
    type: 'tab',
    label: 'Rechercher',
    icon: Search,
    component: HomeScreen
  },
  events: {
    type: 'tab',
    label: 'Agenda',
    icon: CalendarDays,
    component: HomeScreen
  },
  profile: {
    type: 'tab',
    label: 'Profil',
    icon: User,
    component: ProfileScreen
  },
}