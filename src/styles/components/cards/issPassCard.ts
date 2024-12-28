import { app_colors } from "../../../helpers/constants";

export const issPassCardStyles = {
  card: {
    height: 'auto' as 'auto',
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,

    title: {
      color: app_colors.black,
      fontSize: 14,
      fontFamily: 'GilroyBlack',
      // textTransform: 'uppercase' as 'uppercase',
      backgroundColor: app_colors.white,
      paddingVertical: 2,
      borderRadius: 10,
      paddingHorizontal: 5,
    },

    subtitle: {
      color: app_colors.black,
      fontSize: 14,
      fontFamily: 'GilroyRegular',
      // textTransform: 'uppercase' as 'uppercase',
      backgroundColor: app_colors.white,
      paddingVertical: 2,
      borderRadius: 10,
      paddingHorizontal: 5,
    },

    text: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: 'GilroyRegular',
    },

    weatherIcon: {
      width: 30,
      height: 30,
      alignSelf: 'center' as 'center'
    },

    icon: {
      width: 15,
      height: 15
    },

    column: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 5
    },

    row: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      gap: 5
    }
  }
}