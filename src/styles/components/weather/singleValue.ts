import { app_colors } from "../../../helpers/constants";

export const singleValueStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    marginHorizontal: 8,

    value: {
      fontSize: 15,
      fontFamily: 'GilroyMedium',
      color: app_colors.white
    },

    unit: {
      fontSize: 15,
      fontFamily: 'GilroyMedium',
      color: app_colors.white
    }
  }
}