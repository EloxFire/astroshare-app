import { Dimensions, StatusBar } from "react-native";
import { app_colors } from "../../helpers/constants";

export const satelliteTrackerStyles = {
  map: {
    width: Dimensions.get('window').width,
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
  tools: {
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    gap: 20,
    width: Dimensions.get('window').width,
    height: 90,
    bottom: 100,
    backgroundColor: app_colors.black,
    borderTopColor: app_colors.white_eighty,
    borderTopWidth: 1,
    paddingHorizontal: 25,

    button: {
      borderRadius: 10,
      display: 'flex' as 'flex',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      padding: 5,
      gap: 5,
      
      icon: {
        width: 24,
        height: 24,
      },

      label: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: 'AuxMono',
        textTransform: 'uppercase' as 'uppercase',
      }
    }
  },
  issModal: {
    position: 'absolute' as 'absolute',
    bottom: 140,
    left: 0,
    zIndex: 1,
    height: 'auto' as 'auto',
    width: Dimensions.get('window').width - 20,
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
    }
  }
}