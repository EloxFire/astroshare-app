import { app_colors } from "../../helpers/constants";
import { Dimensions } from "react-native";

export const moonPhasesStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    backgroundColor: app_colors.white_no_opacity,
    borderColor: app_colors.white_twenty,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 80,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      transitCard: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',

        icon: {
          width: 30,
          height: 30,
          resizeMode: 'contain' as 'contain'
        },

        text: {
          marginTop: 5,
          fontSize: 16,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
          textAlign: 'center' as 'center'
        }
      }
    },

    body: {

    },

    footer: {

    }
  }
}
