import { app_colors } from "../../../helpers/constants";

export const starlinkTrackerStyles = {
  stats: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',

    stat: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      gap: 5,

      title: {
        color: app_colors.white,
        fontSize: 15,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
      },
      value: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: 'GilroyRegular',
      }
    }
  }
}