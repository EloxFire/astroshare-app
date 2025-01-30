import {app_colors} from "../../../helpers/constants";
import {StatusBar} from "react-native";

export const planetariumUIStyles = {
  container: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    height: "100%" as "100%",
    width: "100%" as "100%",
    zIndex: 10,
    paddingVertical: StatusBar.currentHeight!,
    paddingHorizontal: 10,

    backButton: {
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight! + 10,
      left: 10,
      borderRadius: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      zIndex: 10,
      backgroundColor: app_colors.black_skymap,
      padding: 8,

      text: {
        color: app_colors.white,
        fontSize: 15
      },

      icon: {
        width: 30,
        height: 30,
        tintColor: app_colors.white_sixty,
        transform: [{ rotate: '90deg' }]
      }
    },

    layersModal: {
      backgroundColor: app_colors.black_skymap,
      padding: 10,
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight! + 50,
      right: 10,
      zIndex: 10,
      // height: 150,
      width: 300,
      gap: 20,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'flex-start' as 'flex-start',
      flexWrap: 'wrap' as 'wrap',

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: 5,

        icon: {
          width: 30,
          height: 30,
          tintColor: app_colors.white_sixty,
        },

        text: {
          color: app_colors.white_sixty,
          fontFamily: 'GilroyRegular',
          fontSize: 10
        }
      }
    },

    layerButton: {
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight! + 10,
      right: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      zIndex: 10,
      backgroundColor: app_colors.black_skymap,
      padding: 8,
      borderRadius: 10,

      text: {
        color: app_colors.white,
        fontSize: 15
      },

      icon: {
        width: 30,
        height: 30,
        tintColor: app_colors.white_sixty,
      }
    },

    generalInfosBar: {
      position: 'absolute' as 'absolute',
      bottom: 25,
      left: 10,
      right: 10,
      zIndex: 10,

      header: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        clock: {
          color: app_colors.white_eighty,
          fontSize: 30,
          fontFamily: 'GilroyBlack',
          lineHeight: 30
        },

        location: {
          color: app_colors.white_eighty,
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          lineHeight: 15
        }
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.black_skymap,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,

        image: {
          width: 50,
          height: 50,
        },

        title: {
          color: app_colors.white,
          fontSize: 20,
          fontFamily: 'GilroyBlack'
        },

        subtitle: {
          color: app_colors.white,
          fontSize: 15,
          fontFamily: 'GilroyRegular'
        }
      }
    }
  }
}
