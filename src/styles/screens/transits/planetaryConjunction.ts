import {app_colors} from "../../../helpers/constants";

export const planetaryConjunctionStyles = {
  content: {
    paddingBottom: 80,

    text: {
      fontSize: 14,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
    },

    filters: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      gap: 10,

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.white,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        text: {
          fontSize: 14,
          fontFamily: 'GilroyRegular',
          color: app_colors.black,
        },
      }
    }
  }
}