import { app_colors } from "../../helpers/constants";

export const viewPointsManagerStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    
    title: {
      color: app_colors.white,
      fontSize: 24,
      fontFamily: 'GilroyBlack',
      marginBottom: 20,
      marginTop: 25,
      textTransform: 'uppercase' as 'uppercase',
    },
    
    noViewPoints: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyMedium',
      textAlign: 'center' as 'center',
      backgroundColor: app_colors.white_no_opacity,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
    },

    viewPoints: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      viewPoint: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.white_no_opacity,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: app_colors.white_no_opacity,

        name: {
          color: app_colors.white,
          fontSize: 18,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          marginBottom: 10,
        },

        infos: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          justifyContent: 'space-between' as 'space-between',
          gap: 5,
        },

        text: {
          color: app_colors.white,
          fontSize: 16,
          fontFamily: 'GilroyMedium',
          marginBottom: 5,
        },

        buttons: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          justifyContent: 'flex-end' as 'flex-end',
          gap: 10,
        }
      }
    }
  }
}