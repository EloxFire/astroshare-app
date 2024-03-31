import { app_colors } from "../../helpers/constants";

export const locationHeaderStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    location: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
    
      title: {
        color: app_colors.white,
        opacity: .6,
        textTransform: 'uppercase' as 'uppercase',
      },

      value: {
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
      }
    }
  }
}