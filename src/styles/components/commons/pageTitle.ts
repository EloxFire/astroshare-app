import {StatusBar} from "react-native";

export const pageTitleStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',

    icon: {
      width: 30,
      height: 30,
      marginRight: 5,
      transform: [{ rotate: '90deg' }]
    }
  }
}