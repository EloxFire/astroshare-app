import { app_colors } from "../../helpers/constants";

export const languageSelectionStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,

    button: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      gap: 10,
      minWidth: '45%' as '45%',

      text: {
        color: app_colors.white,
        fontSize: 15,
        fontFamily: 'GilroyBlack'
      },
      
      icon: {
        fontSize: 15,
      }
    }
  }
}