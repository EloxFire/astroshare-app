import { Dimensions, StatusBar } from "react-native";
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

      title: {
        color: app_colors.white,
        fontSize: 20,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        marginBottom: 10
      },
    },

    mapContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,

      map: {
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