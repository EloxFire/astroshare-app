import { Dimensions } from "react-native";
import { app_colors } from "../../../../helpers/constants";

export const toolButtonStyles = {
  button: {
    position: 'relative' as 'relative',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    marginBottom: 10,
    height: 55,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    width: "100%" as "100%",

    image: {
      height: 55,
      width: "100%" as "100%",
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
      fontSize: 16,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
      lineHeight: 25,
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 10,
      fontFamily: 'DMMonoRegular',
    }
  }
}