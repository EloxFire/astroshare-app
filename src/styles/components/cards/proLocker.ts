import {app_colors} from "../../../helpers/constants";

export const proLockerStyles = {
  locker: {
    position: 'relative' as 'relative',
    width: '100%' as '100%',
    height: 200,
    borderRadius: 10,
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',

    image: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,

      dark: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        width: '100%' as '100%',
        height: '100%' as '100%',
        borderRadius: 10
      }
    },

    title: {
      color: app_colors.white,
      fontSize: 25,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    text: {
      color: app_colors.white,
      fontSize: 13,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      textAlign: 'center' as 'center',
    },

    button: {
      backgroundColor: app_colors.white,
      padding: 10,
      borderRadius: 10,
      marginTop: 20,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',

      text: {
        textAlign: 'center' as 'center',
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        fontSize: 14,
        color: app_colors.black
      }
    }
  }
}
