import { app_colors } from "../../../helpers/constants";

export const observationPlannerObjectCardStyles = {
  card:{
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: app_colors.black_twenty,
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,

    row: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 10,
    },

    icon: {
      width: 40,
      height: 40,
      resizeMode: 'contain' as 'contain',
    },

    expandArrow: {
      width: 20,
      height: 20,
      resizeMode: 'contain' as 'contain',
      marginLeft: 'auto' as 'auto',
      tintColor: app_colors.white_sixty,
    },

    primaryInfos: {
      title: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
      },

      subtitle: {
        color: app_colors.white_sixty,
        fontSize: 12,
        fontFamily: 'DMMonoMedium' as 'DMonoMedium',
      }
    },

    secondaryInfos: {
      title: {
        color: app_colors.white_eighty,
        fontSize: 12,
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 14,
        fontFamily: 'GilroyRegular' as 'GilroyRegular',
      }
    }
  },
  
}
