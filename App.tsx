import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { app_routes } from './src/helpers/routes';
import { app_colors } from './src/helpers/colors';
import { TabBar } from './src/components/tabBar/TabBar';

const tabs = Object.keys(app_routes).filter((key) => app_routes[key].type === 'tab');

const HomeTabs = createBottomTabNavigator ({
  tabBar: (props) => <TabBar {...props} />,
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: app_colors.yellow,
    tabBarInactiveTintColor: app_colors.white,
  },
  screens: Object.fromEntries(
    tabs.map((tab) => [
      tab,
      {
        screen: app_routes[tab].component,
        options: {
          tabBarLabel: app_routes[tab].label,
          tabBarIcon: ({ color, size }) => {
            const RouteIcon = app_routes[tab].icon;
            return <RouteIcon color={color} size={size} />;
          },
        },
      },
    ])
  ),
})

// NAVIGATION REACT NATIVE
// GESTION DES ÉCRANS DE L'APPLICATION ICI
// LA NAVIGATION DES TABS EST IMBRIQUÉE DANS LE STACK NAVIGATOR
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <Navigation />
  );
}
