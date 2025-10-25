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
    },

    deleteIcon: {
      width: 20,
      height: 20,
      tintColor: app_colors.red_eighty,
    },

    customSatelliteRow: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
    },

    deleteButton: {
      marginLeft: 10,
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      height: 55,
      width: 55,
      borderWidth: 1,
      borderColor: app_colors.red_eighty,
      backgroundColor: app_colors.white_no_opacity,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
  }
}
