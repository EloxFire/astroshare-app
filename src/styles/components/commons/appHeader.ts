import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const appHeaderStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginBottom: 10,

    logo: {
      maxHeight: 35,
      maxWidth: 116,
    },

    buttons: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      gap: 15,
    },

    tutorialButton: {
      // backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.white,
      borderRadius: 5,
      padding: 3,
      paddingHorizontal: 8,
      zIndex: 10,
      
      text: {
        color: app_colors.white,
        fontSize: 12,
        fontFamily: 'GilroyRegular',
      }
    }
  }
}