import { app_colors } from "../../../helpers/constants";

export const satelliteTrackerHomeStyles = {
  buttons: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginTop: 20,
  },

  addContainer: {
    borderTopWidth: 1,
    borderTopColor: app_colors.white_twenty,
    paddingTop: 10,

    title:{
      color: app_colors.white,
      fontSize: 18,
      marginBottom: 10,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    }
  }
}