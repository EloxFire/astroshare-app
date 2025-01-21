import {app_colors} from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const proFeatureCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    backgroundColor: app_colors.white_no_opacity,
    marginRight: 10,
    width: Dimensions.get('window').width - 20,
    height: 70,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,

    image: {
      borderWidth: 1,
      borderColor: app_colors.white_forty,
      borderRadius: 10,
    },

    bgFilter: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: Dimensions.get('window').width - 20,
      height: 70,
      borderRadius: 10,
      backgroundColor: app_colors.black,
      opacity: 0.8,
    },

    title: {
      color: app_colors.white,
      fontSize: 16,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    description: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      marginTop: 5,
      paddingRight: 50,
      opacity: 0.8,
    }
  }
}