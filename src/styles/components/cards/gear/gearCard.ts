import { app_colors } from "../../../../helpers/constants";

export const gearCardStyles = {
  card: {
    position: 'relative' as 'relative',
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    height: 55,

    badgeContainer: {
      position: 'absolute' as 'absolute',
      top: 10,
      right: 10,
    },

    content: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      flex: 1,

      image: {
        width: 30,
        height: 30,
        marginLeft: 10,
      },


      iconContainer: {
        padding: 5,
        borderRadius: 5,
        
        icon: {
          width: 20,
          height: 20,
        },
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        flex: 1,
        paddingHorizontal: 10,
        
        title: {
          color: app_colors.white,
          fontSize: 18,
          fontFamily: "GilroyBlack" as "GilroyBlack",
          textTransform: 'capitalize' as 'capitalize',
        },
  
        subtitle: {
          color: app_colors.white_sixty,
          fontSize: 12,
          fontFamily: "DMMonoRegular" as "DMMonoRegular",
        },
  
        text: {
          color: app_colors.white,
          fontSize: 14,
          fontFamily: "DMMonoRegular" as "DMMonoRegular",
        },
      }
    }
  }
}