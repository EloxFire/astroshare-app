import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const issTrackerStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    paddingBottom: 80,

    liveStats: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 3,

      title: {
        color: app_colors.white,
        fontSize: 20,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: 'DMMonoRegular',
        marginBottom: 10,
        opacity: 0.5,
      }
    },

    nextPasses: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 3,

      date: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: 'DMMonoMedium',
        textTransform: 'uppercase' as 'uppercase',
        marginBottom: 5,
        marginTop: 10,
      },

      container: {
        position: 'relative' as 'relative',
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        gap: 10,

        premiumLocker:{
          position: 'absolute' as 'absolute',
          height: '100%' as '100%',
          width: '100%' as '100%',
          borderRadius: 10,
          zIndex: 2,
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          justifyContent: 'center' as 'center',
          alignItems: 'center' as 'center',

          title: {
            zIndex: 3,
            position: 'absolute' as 'absolute',
            color: app_colors.white,
            fontSize: 20,
            fontFamily: 'GilroyBlack',
            textTransform: 'uppercase' as 'uppercase',
          }
        },
      },


      title: {
        color: app_colors.white,
        fontSize: 20,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: 'DMMonoRegular',
        marginBottom: 10,
        opacity: 0.5,
      }
    },

    mapContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      flex: 1,
      backgroundColor: app_colors.white_no_opacity,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,

      map: {
        marginTop: 10,
        width: Dimensions.get('screen').width - 42,
        height: Dimensions.get('screen').width - 40,
      }
    },
  },
}