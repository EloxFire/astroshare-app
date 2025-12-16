import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const observationPlannerScreenStyles = {

  modal: {
    flex: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: app_colors.black_skymap,

    content: {
      width: Dimensions.get('window').width - 20,
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 20,
      padding: 20,
    },

    buttons: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-around' as 'space-around',
    }
  },

  content:{
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 15,
    paddingBottom: 50,

    row: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      gap: 10,
      marginBottom: 10,
    },

    bloc: {
      backgroundColor: app_colors.white_no_opacity,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,

      title: {
        fontSize: 16,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        color: app_colors.white,
        marginBottom: 10,
      },

      subtitle: {
        fontSize: 14,
        fontFamily: 'DMMonoRegular',
        color: app_colors.white_eighty,
        marginBottom: 5,
      }
    }
  }
}
