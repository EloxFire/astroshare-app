import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const appUpdateModalStyles = {
  modal : {
    position: 'absolute' as 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    backgroundColor: app_colors.black,
    padding: 10,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    height: 350,
    borderTopWidth: 1,
    borderTopColor: app_colors.yellow,

    title: {
      fontFamily: 'GilroyBlack',
      fontSize: 18,
      color: app_colors.white,
      textAlign: 'center' as 'center',
    },

    subtitle: {
      fontFamily: 'GilroyRegular',
      fontSize: 15,
      color: app_colors.white,
      textAlign: 'center' as 'center',
      marginBottom: 20,
    },

    button: {
      marginTop: 20,
      backgroundColor: app_colors.yellow,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 12,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',

      text: {
        fontFamily: 'GilroyBold',
        fontSize: 16,
        color: app_colors.black,
      }
    },

    closeButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',

      text: {
        fontFamily: 'GilroyMedium',
        fontSize: 14,
        color: app_colors.white_eighty,
      }
    },

    // darkContainer: {
    //   width: '100%' as '100%',
    //   height: '100%' as '100%',
    //   backgroundColor: app_colors.black_eighty,
    //   borderTopLeftRadius: 10,
    //   borderRadius: 10,
    //   borderWidth: 1,
    //   borderColor: app_colors.white_forty,

    // }
  }
}