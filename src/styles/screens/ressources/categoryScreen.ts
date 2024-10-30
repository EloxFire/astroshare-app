import {app_colors} from "../../../helpers/constants";

export const categoriesScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    categoryHeader:{
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,

      title: {
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        borderBottomWidth: 1,
        borderColor: app_colors.white_no_opacity,
        paddingBottom: 5,
        marginBottom: 10,
      },

      subtitle: {
        fontSize: 16,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        marginTop: 10,
        marginBottom: 5,
      },

      description: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
        textAlign: 'justify' as 'justify',
        marginBottom: 10,
      }
    },

    ressourceCard: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,

      image: {
        width: '100%' as '100%',
        height: 80,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: app_colors.white_no_opacity,
        borderBottomWidth: 1,
      },

      content:{
        padding: 10,

        title: {
          fontSize: 16,
          fontFamily: 'GilroyBlack',
          color: app_colors.white,
          textTransform: 'uppercase' as 'uppercase',
        },

        description: {
          fontSize: 12,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
          textAlign: 'justify' as 'justify',
        }
      }
    }
  }
}