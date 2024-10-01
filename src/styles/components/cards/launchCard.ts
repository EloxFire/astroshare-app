import { app_colors } from "../../../helpers/constants";

export const launchCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    backgroundColor: app_colors.white_no_opacity,
    borderColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    height: 150,

    thumbnail: {
      height: 148,
      width: 80,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },
    
    content: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      padding: 10,
      flex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderLeftWidth: 1,
      borderColor: app_colors.white_no_opacity,

      header: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'flex-start' as 'flex-start',

        title: {
          fontSize: 16,
          fontFamily: 'GilroyBlack',
          color: app_colors.white,
        },

        badge: {
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 30,
          color: app_colors.white,
          backgroundColor: app_colors.white_no_opacity,
        },

        subtitleContainer:{
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
  
          label: {
            fontSize: 12,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
            opacity: .5,
          },
  
          text: {
            fontSize: 12,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        }
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',
        paddingTop: 10,

        info: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
  
          label: {
            fontSize: 12,
            fontFamily: 'AuxMono',
            color: app_colors.white,
            opacity: .5,
          },
  
          text: {
            fontSize: 12,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        }
      }
    }
  }
}