import { Dimensions, StatusBar } from "react-native";
import { app_colors } from "../../helpers/constants";

export const satelliteTrackerStyles = {
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
  button: {
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    top: StatusBar.currentHeight! + 100,
    left: 0,
    zIndex: 1,
    width: 50,
    height: 40,
    backgroundColor: app_colors.black,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: app_colors.white_eighty,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,

    centerIss: {
      top: StatusBar.currentHeight! + 150,
    },

    liveFeed: {
      top: StatusBar.currentHeight! + 200,
    }
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
    }
  }
}