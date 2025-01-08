import {app_colors} from "../../../helpers/constants";

export const authStyles = {
  content:{
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    paddingTop: 30,

    logo: {
      maxWidth: 200,
      alignSelf: 'center' as 'center',
    },

    title: {
      fontSize: 30,
      color: app_colors.white,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
      alignSelf: 'center' as 'center',
    },

    subtitle: {
      fontSize: 18,
      color: app_colors.white,
      opacity: .5,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      alignSelf: 'center' as 'center',
    },

    forgotPassword: {
      fontSize: 12,
      color: app_colors.white,
      opacity: .5,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      marginTop: 10,
      textDecorationLine: 'underline' as 'underline',
    },

    form: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginTop: 30,

      input: {
        backgroundColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderColor: app_colors.white_no_opacity,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontFamily: 'GilroyRegular' as 'GilroyRegular',
        color: app_colors.white,
      },

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        gap: 10,
        backgroundColor: app_colors.white,
        padding: 10,
        borderRadius: 10,
        marginTop: 40,

        text: {
          color: app_colors.black,
          fontFamily: 'GilroyRegular' as 'GilroyRegular',
          textTransform: 'uppercase' as 'uppercase',
          fontSize: 16,
        }
      }
    }
  }
}