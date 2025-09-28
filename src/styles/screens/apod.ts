import { app_colors } from "../../helpers/constants";
import {Dimensions} from "react-native";

export const apodStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    paddingBottom: 80,

    image: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_forty,
    },

    imageTitle: {
      color: app_colors.white,
      fontSize: 20,
      marginTop: 10,
      marginBottom: 5,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
    },

    imageDescriptionTitle: {
      color: app_colors.white,
      fontSize: 18,
      marginTop: 20,
      marginBottom: 5,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
    },

    imageDescription: {
      color: app_colors.white,
      fontSize: 16,
      lineHeight: 25,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      textAlign: 'justify' as 'justify',
    },

    imageSubtitle: {
      color: app_colors.white_sixty,
      fontSize: 12,
      marginBottom: 5,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
    },

    loadingText: {
      color: app_colors.white,
      fontSize: 12,
      textAlign: 'center' as 'center',
    },

    errorBox: {
      width: Dimensions.get('window').width - 40,
      backgroundColor: app_colors.red_twenty,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.red_eighty,
      padding: 10,
    }
  }
}
