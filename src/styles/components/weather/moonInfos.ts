import { app_colors } from "../../../helpers/constants";

export const moonInfosStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    marginTop: 20,

    illustration: {
      width: 100,
      height: 100,
    },

    title: {
      color: app_colors.white,
      fontSize: 16,
      marginLeft: 5,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },
    
    infos: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      marginTop: 10,
      marginLeft: 5,
      gap: 15,
    },
  }
}