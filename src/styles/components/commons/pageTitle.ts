import {StatusBar} from "react-native";

export const pageTitleStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20,

    icon: {
      width: 30,
      height: 30,
      marginRight: 5,
      transform: [{ rotate: '90deg' }]
    }
  }
}