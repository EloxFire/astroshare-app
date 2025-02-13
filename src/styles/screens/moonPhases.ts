import { app_colors } from "../../helpers/constants";
import { Dimensions } from "react-native";

export const moonPhasesStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    paddingBottom: 80,

    title: {
      fontFamily: 'GilroyBlack',
      fontSize: 22,
      color: app_colors.white,
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
      marginBottom: 20,
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
    },

    calendarHeader: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      marginTop: 20,
    },

    calendar: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
      marginVertical: 20,
      justifyContent: 'space-between' as 'space-between',

      day: {
        width: (Dimensions.get('screen').width / 2) - 20,
        backgroundColor: app_colors.white_no_opacity,
        borderColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,

        title: {
          fontFamily: 'GilroyBlack',
          fontSize: 16,
          color: app_colors.white,
          textTransform: 'uppercase' as 'uppercase',
        }
      }
    }
  }
}