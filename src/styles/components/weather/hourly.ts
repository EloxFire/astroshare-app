import { app_colors } from "../../../helpers/constants";

export const hourlyStyles = {
  content: {
    marginTop: 20,
    height: 300,

    title: {
      fontSize: 12,
      color: app_colors.white,
      marginBottom: 10,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    hour: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginBottom: 10,
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: app_colors.white_forty,
      
      row: {
        marginBottom: 2,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'space-between' as 'space-between',
      }
    }
  }
}