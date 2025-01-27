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

        icon: {
          width: 50,
          height: 50,
          resizeMode: 'contain' as 'contain'
        },

        text: {
          fontSize: 12,
          fontFamily: 'GilroyRegular',
          color: app_colors.white
        }
      }
    },

    body: {

    },

    footer: {

    }
  }
}
