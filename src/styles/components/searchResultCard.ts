import { app_colors } from "../../helpers/constants";

export const searchResultCardStyles = {
  card: {
    padding: 10,
    marginRight: 10,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    width: 250,
    height: 230,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',

      title: {
        fontSize: 20,
        color: app_colors.white,
        fontFamily: 'GilroyBlack'
      },

      subtitle: {
        fontSize: 12,
        color: app_colors.white,
        marginBottom: 5,
        fontFamily: 'GilroyMedium'
      }
    },

    image: {
      width: 65,
      height: 65,
      resizeMode: 'contain' as 'contain'
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      info: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        marginTop: 5,

        title: {
          fontSize: 12,
          color: app_colors.white,
          fontFamily: 'GilroyBlack'
        },

        value: {
          fontSize: 12,
          color: app_colors.white,
          fontFamily: 'GilroyMedium'
        }
      }
    },

    footer: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',

      chip:{
        paddingVertical: 2,
        paddingHorizontal: 10,
        fontSize: 12,
        fontFamily: 'GilroyMedium',
        color: app_colors.white,
        alignSelf: 'flex-start' as 'flex-start',
        borderRadius: 10,
      }
    }
  },
}