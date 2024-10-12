import {app_colors} from "../../../../helpers/constants";

export const nextLaunchCountdownWidgetStyles = {
  widget: {
    width: '100%' as '100%',
    height: 120,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden' as 'hidden',

    backgroundImage: {
      flex: 1,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      position: 'relative' as 'relative',

      filter: {
        backgroundColor: app_colors.black,
        opacity: 0.50,
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        width: '100%' as '100%',
        height: '100%' as '100%',
      }
    },

    content: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      flex: 1,
      width: '100%' as '100%',
      padding: 10,

      text: {
        fontSize: 15,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
      },

      countdown: {
        fontSize: 20,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        // textTransform: 'uppercase' as 'uppercase',

        sub: {
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
        }
      },

      badge: {
        borderRadius: 30,
        color: app_colors.white,
        backgroundColor: app_colors.white_no_opacity,
        fontSize: 12,
        height: 25,
        minWidth: 50,
        verticalAlign: 'middle' as 'middle',
        textAlign: 'center' as 'center',
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'flex-end' as 'flex-end',
        flex: 1,

        info:{
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          alignItems: 'center' as 'center',
          gap: 5,

          icon: {
            width: 18,
            height: 18,
          },

          value: {
            fontSize: 12,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        }
      }
    }
  }
}