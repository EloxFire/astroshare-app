import {app_colors} from "../../../helpers/constants";

export const planetaryConjunctionStyles = {
  content: {
    paddingBottom: 80,

    filters: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      marginBottom: 20,

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.white_no_opacity,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        gap: 5,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        text: {
          fontSize: 14,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
        },

        image: {
          width: 20,
          height: 20,
        }
      }
    }
  }
}