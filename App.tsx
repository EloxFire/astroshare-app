import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { BasicToolsScreen } from './src/screens/tabs/BasicTools/BasicTools';
import { ProfileScreen } from './src/screens/tabs/Profile/Profile';

const HomeTabs = createBottomTabNavigator ({
  screens: {
    BasicTools: {
      screen: BasicToolsScreen,
      options: {
        headerShown: false,
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        headerShown: false,
      },
    },
  }
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
