import { app_colors } from "../../helpers/constants";

export const objectDetailsStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 20,

    header:{
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      gap: 10,

      title: {
        fontSize: 35,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },

      subtitle: {
        fontSize: 20,
        color: app_colors.white,
        fontFamily: 'GilroyRegular',
      },

      image: {
        width: 150,
        height: 150,
        borderRadius: 10
      }
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 10,

      info: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        gap: 10,

        title: {
          fontSize: 20,
          color: app_colors.white,
          fontFamily: 'GilroyRegular',
        },

        value: {
          fontSize: 20,
          color: app_colors.white,
          fontFamily: 'GilroyMedium',
        }
      },

      title: {
        fontSize: 25,
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        borderTopWidth: 1,
        borderTopColor: app_colors.white,
        paddingTop: 8,
      }
    }
  }
}