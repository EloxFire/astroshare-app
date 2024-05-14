import { app_colors } from "../../helpers/constants";

export const apodStyles = {
  content: {
    paddingTop: 10,
    display: 'flex' as 'flex',
    flecDirection: 'column' as 'column',
    alignItems: 'center' as 'center',

    title: {
      fontSize: 38,
      textTransform: 'uppercase' as 'uppercase',
      fontFamily: 'GilroyBlack',
      textAlign: 'center' as 'center',
      marginBottom: 10,
      color: app_colors.white
    },

    subtitle: {
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      fontSize: 25,
      textAlign: 'left' as 'left',
      alignSelf: 'flex-start' as 'flex-start',
      marginBottom: 10
    },
    
    text: {
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      fontSize: 16,
      textAlign: 'justify' as 'justify',
    }
  }
}