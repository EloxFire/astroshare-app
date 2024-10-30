import {app_colors} from "../../../helpers/constants";

export const ressourcesScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    title:{
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyBlack',
      marginBottom: 20,
      textTransform: 'uppercase' as 'uppercase',
    },

    category: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      borderWidth: 1,
      borderColor: app_colors.white_forty,
      borderBottomLeftRadius: 10,
      borderTopRightRadius: 10,

      background: {
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
      },

      title: {
        color: app_colors.white,
        fontSize: 20,
        fontWeight: 'bold' as 'bold',
        padding: 10,
      }
    }
  }
}