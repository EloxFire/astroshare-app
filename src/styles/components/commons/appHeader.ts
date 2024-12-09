import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const appHeaderStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginBottom: 15,

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

      pro:{
        position: 'relative' as 'relative',
        marginRight: 5,

        star1:{
          position: 'absolute' as 'absolute',
          left: -8,
          top: -3,
          width: 7,
          height: 7,
        },

        star2:{
          position: 'absolute' as 'absolute',
          left: 20,
          top: -5,
          width: 5,
          height: 5,

        },

        star3:{
          position: 'absolute' as 'absolute',
          left: 25,
          top: 0,
          width: 8,
          height: 8,
        },

        star4:{
          position: 'absolute' as 'absolute',
          left: 5,
          top: 15,
          width: 5,
          height: 5,
        }
      }
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