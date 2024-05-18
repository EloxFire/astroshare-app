import { app_colors } from "../../../../helpers/constants";

export const simpleButtonStyles = {
  button: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center' as 'center',

    text: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyMedium',
    },
  }
}