import {app_colors} from "../../../helpers/constants";

export const celestialBodiesOverviewStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 20,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      gap: 20,
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,

      icon: {
        width: 80,
        height: 80,
        borderWidth: 1,
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
    }
  }
}