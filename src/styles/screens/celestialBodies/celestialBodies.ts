import {app_colors} from "../../../helpers/constants";

export const celestialBodiesOverviewStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 20,

    sectionTitle: {
      fontSize: 15,
      fontFamily: 'GilroyBlack',
      color: app_colors.white,
      textTransform: 'uppercase' as 'uppercase',
    },

    header: {
      position: 'relative' as 'relative',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      gap: 10,
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,

      icon: {
        width: 80,
        height: 80,
      },

      infos: {
        flex: 1,
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start' as 'flex-start',
        justifyContent: 'space-between' as 'space-between',
        gap: 20,

        title: {
          fontSize: 25,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white,
        },

        subtitle: {
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
          opacity: 0.5,
        },

        badges: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          flexWrap: 'wrap' as 'wrap',
          gap: 5,
        }
      }
    },

    positionContainer: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,

      content: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',

        position: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
        },

        constel: {
          // backgroundColor: 'red',
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          justifyContent: 'center' as 'center',
          alignItems: 'flex-end' as 'flex-end',
          width: '30%' as  '30%',
          gap: 10,
          marginTop: 10,
          flex: 1,
          paddingLeft: 10,

          image: {
            width: 80,
            height: 80,
            tintColor: app_colors.white,
          }
        }
      },
    },

    visibilityContainer: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
    },

    moreContainer: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      marginBottom: 50,

      infos: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        marginTop: 10,
        gap: 10,
      }
    }
  }
}