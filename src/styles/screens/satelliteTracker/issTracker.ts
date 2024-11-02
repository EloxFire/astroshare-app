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
        fontFamily: 'AuxMono',
        marginBottom: 10,
        opacity: 0.5,
      }
    },

    mapContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,

      map: {
        marginTop: 10,
        width: Dimensions.get('screen').width - 40,
        height: Dimensions.get('screen').width - 40,
      }
    },

    nextPasses: {
      borderWidth : 1,
      borderColor: app_colors.white_no_opacity,
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
    }
  },
}