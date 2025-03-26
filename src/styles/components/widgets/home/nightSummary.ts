import { app_colors } from "../../../../helpers/constants";

export const nightSummaryStyles = {
  container: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    marginTop: 10,
    height: 120,
    padding: 10,
    
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
    
    backgroundPicture: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_forty,
    },

    title: {
      fontSize: 16,
      textTransform: 'uppercase' as 'uppercase',
      fontFamily: 'GilroyBlack',
      color: app_colors.white,
      backroundColor: 'red',
    },
    
    blur: {
      borderColor: app_colors.white,
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      opacity: 0.67,
      borderRadius: 10,
    },

    data: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      marginTop: 10,

      timings: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        gap: 10,

        info: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',

          title: {
            fontSize: 10,
            fontFamily: 'GilroyBlack',
            textTransform: 'uppercase' as 'uppercase',
            color: app_colors.white,
          },

          value: {
            fontSize: 14,
            fontFamily: 'DMMonoRegular',
            color: app_colors.white,
          }
        }
      },

      moon: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        gap: 8,
        flex: 1,

        icon: {
          height: 75,
          width: 75,
        },

        title: {
          fontSize: 12,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white,
        }
      },

      planets: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        justifyContent: 'flex-end' as 'flex-end',
        gap: 5,
        maxWidth: 150,

        planet: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          alignItems: 'center' as 'center',
          gap: 5,

          icon: {
            height: 15,
            width: 15,
          },

          name: {
            fontSize: 8.5,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        }
      }
    }
  }
}