import { app_colors } from "../../helpers/constants";

export const weatherStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    resetButton: {
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      padding: 10,
      marginBottom: 15,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center'
    },

    text: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white
    },

    weather: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      header: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'space-between' as 'space-between',

        cityInfos: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          alignItems: 'flex-end' as 'flex-end',
          justifyContent: 'center' as 'center',
        },

        title: {
          fontSize: 25,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white
        },

        subtitle: {
          fontSize: 12,
          fontFamily: 'GilroyRegular',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white
        },

        temp: {
          fontSize: 60,
        },

        description: {
          fontSize: 20,
          textAlign: 'center' as 'center',
        }
      }
    },

    weatherContainer: {
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      padding: 10,
      marginBottom: 15,
    },

    ephemerisBar: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      borderRadius: 10,
      marginTop: 10,
      position: 'relative' as 'relative',
      
      container: {
        position: 'absolute' as 'absolute',
        width: '85%' as '85%',
        left: '7.5%' as '7.5%',
        backgroundColor: app_colors.white_no_opacity,
        height: 10,
        borderRadius: 10,
      },

      progress: {
        height: 10,
        backgroundColor: app_colors.white,
        borderRadius: 10,
        position: 'absolute' as 'absolute',
        left: '7.5%' as '7.5%',
      }
    }
  }
}