import {app_colors} from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const solarEclipseDetailsStyles = {
  content: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 10,

    loadingScreen: {
      flex: 1,
      display: "flex" as "flex",
      justifyContent: "center" as "center",
      alignItems: "center" as "center",

      text: {
        color: app_colors.white,
        fontFamily: "GilroyRegular",
        fontSize: 18,
        marginTop: 10
      }
    },

    section: {
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      padding: 10,

      sectionTitle: {
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        color: app_colors.white,
      }
    },

    overlay: {
      flex: 1,
      position: 'absolute' as 'absolute',
      bottom: 50,
      width: Dimensions.get('window').width - 20,
      marginHorizontal: 10,
      padding: 10,
      backgroundColor: app_colors.black,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,

      title: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        marginBottom: 10
      }
    }
  },

  map: {
    flex: 1
  }
}