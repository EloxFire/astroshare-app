import { app_colors } from "../../../helpers/constants";

export const bigButtonStyles = {
  button: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 8,
    minWidth: '30%',

    icon: {
      width: 50,
      height: 50,
    },

    text: {
      color: app_colors.white,
      fontSize: 18,
      textAlign: 'center' as 'center',
    }
  }
}