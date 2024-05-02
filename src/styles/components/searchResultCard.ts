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
    height: 210,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',

      title: {
        fontSize: 25,
        color: app_colors.white,
        fontFamily: 'GilroyBlack'
      },

      subtitle: {
        fontSize: 16,
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
          fontSize: 16,
          color: app_colors.white,
          fontFamily: 'GilroyBlack'
        },

        value: {
          fontSize: 16,
          color: app_colors.white,
          fontFamily: 'GilroyMedium'
        }
      }
    },
    
    chip:{
      paddingVertical: 2,
      paddingHorizontal: 10,
      fontSize: 16,
      fontFamily: 'GilroyMedium',
      color: app_colors.white,
      alignSelf: 'flex-start' as 'flex-start',
      borderRadius: 10,
    }
  },
}