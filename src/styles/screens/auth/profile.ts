import {app_colors} from "../../../helpers/constants";

export const profileScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    header: {
      marginTop: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      marginBottom: 15,

      fakePicture: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderColor: app_colors.white_no_opacity,
        marginRight: 15,

        icon: {
          width: 40,
          height: 40,
        }
      },

      infos: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start' as 'flex-start',
        justifyContent: 'center' as 'center',

        title: {
          fontSize: 25,
          color: app_colors.white,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
        },

        mail: {
          fontSize: 16,
          color: app_colors.white,
          fontFamily: 'GilroyRegular' as 'GilroyRegular',
        }
      }
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 5,
      marginBottom: 15,
    },

    button: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: app_colors.white_no_opacity,
      padding: 10,
      borderRadius: 10,
      marginTop: 40,

      text: {
        fontSize: 16,
        color: app_colors.red_eighty,
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
      }
    }
  }
}
