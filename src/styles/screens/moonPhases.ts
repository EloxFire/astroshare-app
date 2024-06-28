import { counterEvent } from "react-native/Libraries/Performance/Systrace";
import { app_colors } from "../../helpers/constants";

export const moonPhasesStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    title: {
      fontFamily: 'GilroyBlack',
      fontSize: 22,
      color: app_colors.white,
      marginBottom: 5,
      textTransform: 'uppercase' as 'uppercase',
      alignSelf: 'center' as 'center'
    },

    phaseContainer: {
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
    },

    valuesContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      paddingTop: 20,
    },    

    selectButton: {
      backgroundColor: app_colors.white_no_opacity,
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderRadius: 10,
      marginBottom: 10,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      alignSelf: 'center' as 'center',

      text: {
        fontFamily: 'GilroyRegular',
        fontSize: 16,
        color: app_colors.white,
        textAlign: 'center' as 'center'
      }
    }
  }
}