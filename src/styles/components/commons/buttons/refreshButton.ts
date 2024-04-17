import { app_colors } from "../../../../helpers/constants";

export const refreshButtonStyles = {
  button: {
    backgroundColor: app_colors.white_no_opacity,
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    padding: 5,
    borderRadius: 10,
    width: 30,
    height: 30,

    icon: {
      width: 15,
      height: 15,
    }
  }
}