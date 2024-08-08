import { app_colors } from "../../helpers/constants";

export const weatherStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    inputContainer:{
      width: '100%' as '100%',
      height: 70
    },

    text: {
      fontSize: 12,
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

        subtitle: {
          fontSize: 10,
          fontFamily: 'GilroyRegular',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white
        },

        temp: {
          fontSize: 45,
        },

        description: {
          fontSize: 15,
          textAlign: 'center' as 'center',
        }
      }
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
        maxWidth: '85%' as '85%',
        left: '7.5%' as '7.5%',
      }
    },

    moonContent: {
      marginTop: 20,
    }
  },

  legend: {
    display: 'flex' as 'flex',
    flexWrap: 'wrap' as 'wrap',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginLeft: -10,
    marginBottom: 50,
  },

  weatherContainer: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    padding: 10,
    marginBottom: 15,

    title: {
      fontSize: 20,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
      color: app_colors.white,
    },

    subtitle: {
      fontSize: 12,
      fontFamily: 'GilroyMedium',
      textTransform: 'uppercase' as 'uppercase',
      color: app_colors.white
    },

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
  },
}