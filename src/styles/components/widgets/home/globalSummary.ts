import { app_colors } from "../../../../helpers/constants";

export const globalSummaryStyles = {
  container: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    marginTop: 10,
    height: 120,
    padding: 10,
    
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    position: 'relative' as 'relative',
    
    backgroundPicture: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_forty,
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
    
    weatherContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      height: '100%' as '100%',
      justifyContent: 'space-between' as 'space-between',
      
      city: {
        fontSize: 14,
        textTransform: 'uppercase' as 'uppercase',
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },

      description: {
        fontSize: 16,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
      },
      
      conditions: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        gap: 10,

        icon: {
          width: 45,
          height: 45,
        },

        infos: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          justifyContent: 'center' as 'center',
          gap: 5,
            
          info: {
            display: 'flex' as 'flex',
            flexDirection: 'row' as 'row',
            alignItems: 'center' as 'center',
            gap: 3,
            
            icon: {
              width: 16,
              height: 16,
            },

            value: {
              fontSize: 16,
              fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
              color: app_colors.white,
            }
          }
        }
      }
    },

    currentSkyContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'flex-end' as 'flex-end',
      gap: 5,

      title: {
        fontSize: 14,
        textTransform: 'uppercase' as 'uppercase',
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },

      planets: {
        maxWidth: 180,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        justifyContent: 'flex-end' as 'flex-end',
        gap: 10,

        empty: {
          fontSize: 12,
          fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
          color: app_colors.white,
        },

        planet: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          alignItems: 'center' as 'center',

          icon: {
            width: 20,
            height: 20,
            marginBottom: 5,
          },

          name: {
            fontSize: 9,
            fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
            color: app_colors.white,
          }
        }
      }
    }
  }
}