import {app_colors} from "../../../helpers/constants";

export const profileScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,

    


    section: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
      gap: 5,

      title: {
        fontSize: 18,
        color: app_colors.white,
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        // textTransform: 'uppercase' as 'uppercase',
        marginBottom: 5,
      },

      subtitle: {
        color: app_colors.white,
        fontFamily: 'GilroyLight' as 'GilroyLight',
        fontSize: 14,
      }
    }
  }
}
