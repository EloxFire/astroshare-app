import { app_colors } from "../../../helpers/constants";

export const disclaimerBarStyles = {
  bar: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'flex-start' as 'flex-start',
    padding: 10,
    borderRadius: 5,

    text: {
      color: app_colors.white,
      opacity: .5,
      fontSize: 12,
      fontFamily: 'GilroyRegular',
      flex: 1
    },

    icon: {
      width: 20,
      height: 20,
      marginRight: 10,
      opacity: .5
    }
  }
}