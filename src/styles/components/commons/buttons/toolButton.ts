import { Dimensions } from "react-native";
import { app_colors } from "../../../../helpers/constants";

export const toolButtonStyles = {
  button: {
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    height: 55,
    width: Dimensions.get('window').width - 20,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',

    image: {
      position: 'absolute' as 'absolute',
      right: 0,
      bottom: 0,
      height: 55,
      width: Dimensions.get('window').width - 20,
      borderRadius: 10,
      opacity: .2,
    },

    icon: {
      width: 30,
      height: 30,
      marginRight: 10,
    },

    text: {
      color: app_colors.white,
      fontSize: 20,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
      lineHeight: 25,
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 10,
      fontFamily: 'AuxMono',
    }
  }
}