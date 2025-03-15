import {app_colors} from "../../../helpers/constants";

export const solarEclipseScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    yearInput: {
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      fontSize: 15,
      padding: 8,
      borderRadius: 10,
      textAlign: 'center' as 'center',
      verticalAlign: 'middle' as 'middle',
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      backgroundColor: app_colors.white_no_opacity,
      flex: 1,
    }
  }
}