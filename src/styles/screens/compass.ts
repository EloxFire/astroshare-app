import { app_colors } from "../../helpers/constants";

export const compassStyles = {
  content: {
    marginTop: 40,
    alignItems: 'center' as 'center',

    header: {
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      height: '100%' as '100%',

      title: {
        fontSize: 35,
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
      }
    },

    compass: {
      marginTop: 20,
      height: 300,
      width: 300,
      borderRadius: 300,
    }
  }
}