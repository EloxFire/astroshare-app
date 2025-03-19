import {app_colors} from "../../../helpers/constants";
import {Dimensions, StatusBar} from "react-native";

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
      bottom: 0,
      width: Dimensions.get('window').width,
      padding: 10,
      paddingBottom: 30,
      backgroundColor: app_colors.black,
      borderTopWidth: 1,
      borderTopColor: app_colors.white_sixty,
      borderRightWidth: 1,
      maxHeight: 400,

      backButton: {
        position: 'absolute' as 'absolute',
        top: StatusBar.currentHeight! + 10,
        left: 10,
      },

      title: {
        color: app_colors.white,
        fontSize: 25,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        opacity: .5,
      },

      noEclipse: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyRegular',
        marginTop: 10,
        textAlign: 'center' as 'center',
        borderTopWidth: 1,
        borderTopColor: app_colors.white_twenty,
        paddingTop: 10,
        marginHorizontal: 20,

      },

      circumstances: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
        borderTopWidth: 1,
        borderTopColor: app_colors.white_twenty,
        paddingTop: 10,
        marginTop: 10,

        title: {
          color: app_colors.white,
          fontSize: 15,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          marginBottom: 10,
        }
      }
    }
  },

  map: {
    flex: 1
  }
}