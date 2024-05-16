import { app_colors } from "../../helpers/constants";

export const disclaimerBarStyles = {
  bar: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'center' as 'center',
    padding: 4,
    borderRadius: 5,
    marginTop: -15,

    text: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: 'GilroyRegular',
      flex: 1
    },

    icon: {
      width: 20,
      height: 20,
      marginRight: 10
    }
  }
}