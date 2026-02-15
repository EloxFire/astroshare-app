import { app_colors } from "../../../../helpers/constants";

export const subscriptionManagementStyles = {
  section: {
    backgroundColor: app_colors.white_no_opacity,
    padding: 10,
    borderRadius: 10,

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 10,
      marginTop: 20,
    },

    title: {
      fontSize: 18,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      color: app_colors.white,
    },

    text: {
      fontSize: 14,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      color: app_colors.white,
    }
  }
}