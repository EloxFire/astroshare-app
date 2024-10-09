import { app_colors } from "../../helpers/constants";

export const aboutStyles = {
  content: {
    marginTop: 10,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    paddingBottom: 50,

    card: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      gap: 10,

      header: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        gap: 10,

        title: {
          color: app_colors.white,
          fontSize: 18,
          fontFamily: 'GilroyBlack',
        },

        icon: {
          width: 20,
          height: 20,
        },
      },

      separator: {
        backgroundColor: app_colors.white_twenty,
        height: 1,
        width: '100%' as '100%',
      },

      text: {
        color: app_colors.white,
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        textAlign: 'justify' as 'justify',
        whiteSpace: 'pre-line' as 'pre-line',
      }
    }
  }
}