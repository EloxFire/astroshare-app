import {app_colors} from "../../../helpers/constants";

export const planetaryConjunctionStyles = {
  content: {
    paddingBottom: 80,

    row: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      gap: 20,
      marginBottom: 5,
    },

    parameters: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 5,
      marginTop: 10,
      marginBottom: 50,

      text: {
        fontFamily: 'GilroyRegular',
        fontSize: 15,
        color: app_colors.white,
      },

      dropdown: {
        height: 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center' as 'center',

        withIcon: {
          flexDirection: 'row' as 'row',
          justifyContent: 'space-between' as 'space-between',
          alignItems: 'center' as 'center',
        },

        text: {
          color: app_colors.white,
          fontFamily: 'GilroyRegular',
          fontSize: 15,
        },

        list: {
          backgroundColor: app_colors.black,
          marginTop: -50,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,

          item: {
            backgroundColor: app_colors.white_no_opacity,
            height: 50,
            display: 'flex' as 'flex',
            flexDirection: 'row' as 'row',
            justifyContent: 'space-between' as 'space-between',
            gap: 20,
            paddingHorizontal: 30,
            alignItems: 'center' as 'center',
            borderBottomWidth: 1,
            borderBottomColor: app_colors.white_twenty,

            value: {
              fontFamily: 'GilroyRegular',
              fontSize: 15,
              color: app_colors.white,
            }
          }
        }
      }
    }
  }
}