import { app_colors } from "../../../helpers/constants";

export const issPassCardStyles = {
  card: {
    height: 80,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    text: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: 'GilroyRegular',
    }
  }
}