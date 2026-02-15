import { app_colors } from "../../../../helpers/constants";

export const subscriptionCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    gap: 10,
    backgroundColor: app_colors.white_no_opacity,
    padding: 10,
    borderRadius: 10,

    row:{
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      gap: 5,
    },

    date: {
      fontSize: 14,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      color: app_colors.white,
    },

    amount: {
      fontSize: 14,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      color: app_colors.white,
    },

    button: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 5,
      padding: 5,
      backgroundColor: app_colors.white_twenty,
      borderRadius: 5,
    },

    label: {
      fontSize: 10,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      color: app_colors.white_eighty,
    }
  }
}