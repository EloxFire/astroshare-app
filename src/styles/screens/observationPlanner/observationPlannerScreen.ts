import { app_colors } from "../../../helpers/constants";

export const observationPlannerScreenStyles = {
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
