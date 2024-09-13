import { StatusBar } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const planetariumStyles = {
  container: {
    backgroundColor: app_colors.black,
    flex: 1,
    position : 'relative' as 'relative',

    backButton: {
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight! + 10,
      left: 10,
      backgroundColor: app_colors.white_no_opacity,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',

      text: {
        color: app_colors.white,
        fontSize: 15
      },

      icon: {
        width: 20,
        height: 20,
        tintColor: app_colors.white,
        transform: [{ rotate: '90deg' }]
      }
    }
  }
}