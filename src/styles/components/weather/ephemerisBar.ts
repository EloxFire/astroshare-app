import { app_colors } from "../../../helpers/constants";

export const ephemerisBarStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    // alignItems: 'center' as 'center',
    marginBottom: 15,

    sideColumn: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',

      icon: {
        width: 20,
        height: 20,
        marginBottom: 8
      }
    },

    bar: {
      position: 'relative' as 'relative',
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      height: 10,
      width: '70%' as '70%',
      marginTop: 5,

      progress: {
        position: 'absolute' as 'absolute',
        height: 10,
        backgroundColor: app_colors.white,
        borderRadius: 10,
      }
    }
  }
}