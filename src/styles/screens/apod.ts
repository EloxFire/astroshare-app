import { app_colors } from "../../helpers/constants";

export const apodStyles = {
  content: {
    paddingTop: 10,
    display: 'flex' as 'flex',
    flecDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    paddingBottom: 60,

    title: {
      fontSize: 25,
      textTransform: 'uppercase' as 'uppercase',
      fontFamily: 'GilroyBlack',
      textAlign: 'center' as 'center',
      marginBottom: 10,
      color: app_colors.white
    },

    subtitle: {
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      fontSize: 20,
      textAlign: 'left' as 'left',
      alignSelf: 'flex-start' as 'flex-start',
      marginBottom: 10
    },
    
    text: {
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      fontSize: 12,
      textAlign: 'justify' as 'justify',
    }
  }
}