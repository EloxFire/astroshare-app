import { counterEvent } from "react-native/Libraries/Performance/Systrace";
import { app_colors } from "../../helpers/constants";

export const moonPhasesStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    title: {
      fontFamily: 'GilroyBlack',
      fontSize: 28,
      color: app_colors.white,
      marginBottom: 5,
      textTransform: 'uppercase' as 'uppercase'
    },

    values: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      marginTop: 10,
    }
  }
}