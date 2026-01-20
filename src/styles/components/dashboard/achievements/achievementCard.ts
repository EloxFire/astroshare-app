import { app_colors } from "../../../../helpers/constants";

export const achievementCardStyles = {
  card: {
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
    padding: 10,
    
    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      gap: 10,
      
      icon: {
        width: 20,
        height: 20,
      },
  
      title: {
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        color: app_colors.white,
      },
  
      description: {
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
        color: app_colors.white_eighty,
        fontSize: 12
      }
    },

    progressContainer: {
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: app_colors.white_twenty,
      paddingTop: 10,

      text: {
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
        color: app_colors.white,
        marginBottom: 5,
        fontSize: 12,
      }
    }
  }
}