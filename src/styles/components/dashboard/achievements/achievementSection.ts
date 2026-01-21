import { app_colors } from "../../../../helpers/constants";

export const achievementSectionStyles = {
  section: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    
    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      
      chevron: {
        width: 20,
        height: 20,
      },
  
      progressContainer: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        gap: 10,
        flex: 1,
        paddingRight: 10,
        
        title: {
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          fontSize: 18,
          color: app_colors.white,
          marginBottom: 5,
          textTransform: 'uppercase' as 'uppercase',
        },
      },
    },

    achievements: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 10,
      borderTopWidth: 1,
      borderTopColor: app_colors.white_twenty,
      marginTop: 10,
      paddingTop: 10,
    }
  }
}