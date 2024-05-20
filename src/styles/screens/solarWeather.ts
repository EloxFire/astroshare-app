import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const solarWeatherStyles = {
  container: {
    padding: 10,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,

    title: {
      color: app_colors.white,
      fontSize: 20,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      opacity: .5,
      fontSize: 10,
      fontFamily: 'GilroyMedium',
      // marginBottom: 15,
    }
  },

  sunImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    alignSelf: 'center' as 'center',
    borderRadius: 10,
    marginTop: 15,
  }
}