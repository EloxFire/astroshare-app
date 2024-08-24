import { Dimensions, StatusBar } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const issTrackerStyles = {
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    paddingTop: 100,
  },
  pageControls: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: app_colors.black,
    borderBottomWidth: 1,
    borderColor: app_colors.white_eighty,
    padding: 10,
    paddingTop: StatusBar.currentHeight
  },
  buttons: {
    position: 'absolute' as 'absolute',
    top: StatusBar.currentHeight! + 75,
    left: 0,
    width: Dimensions.get('screen').width,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',

    button: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      zIndex: 1,
      width: Dimensions.get('screen').width / 3 - 20,
      height: 35,
      gap: 10,
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      marginRight: 10,

      text: {
        color: app_colors.white,
        fontSize: 12,
        fontFamily: 'GilroyRegular',
        textTransform: 'uppercase' as 'uppercase',
      }
    },
  },
  issModal: {
    position: 'absolute' as 'absolute',
    bottom: 40,
    left: 0,
    zIndex: 1,
    height: 'auto' as 'auto',
    width: Dimensions.get('screen').width - 20,
    marginHorizontal: 10,
    backgroundColor: app_colors.black,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.white_eighty,

    title: {
      color: app_colors.white,
      fontSize: 15,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 12,
      fontFamily: 'AuxMono',
    },

    liveDot: {
      width: 10,
      height: 10,
      borderRadius: 10,
      backgroundColor: app_colors.red,
      marginRight: 5,
    }
  }
}