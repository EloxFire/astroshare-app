import { app_colors } from "../../helpers/constants";

export const settingsStyles = {
  content: {
    marginTop: 20,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    categoryTitle: {
      fontSize: 16,
      color: app_colors.white,
      marginBottom: 5,
      marginTop: 10,
      opacity: .5,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    }
  }
};
