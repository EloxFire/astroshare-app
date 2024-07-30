import { app_colors } from "../../helpers/constants";

export const scopeAlignmentStyles = {
  header: {
    height: 'auto' as 'auto',
    title: {
      color: app_colors.white,
      fontSize: 30,
      textAlign: "center" as "center",
      fontFamily: "GilroyBlack",
      textTransform: "uppercase" as "uppercase",
    },
    description: {
      color: app_colors.white,
      fontSize: 18,
      textAlign: "center" as "center",
      fontFamily: "GilroyMedium",
      marginBottom: 25,
    }
  },
  content: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    flex: 1,
    
    list: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      gap: 50,
      flex: 1,
      justifyContent: "space-between" as "space-between",
      paddingBottom: 150,
      
      listElement: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
  
        number: {
          color: app_colors.white,
          fontSize: 50,
          fontFamily: "GilroyBlack",
          opacity: 0.3,
        },
  
        value: {
          color: app_colors.white,
          fontSize: 15,
          fontFamily: "GilroyRegular",
        }
      }
    },

    text: {
      color: app_colors.white,
      fontSize: 15,
      marginBottom: 15,
    }
  },

  footer: {
    height: 'auto' as 'auto',
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 10,
    marginBottom: 40,

    button: {
      backgroundColor: app_colors.white,
      borderRadius: 10,
      padding: 3,
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      alignItems: "center" as "center",
      justifyContent: "center" as "center",
      width: '75%' as '50%',
      alignSelf: 'center' as 'center',
      minHeight: 35,

      text: {
        color: app_colors.black,
        fontSize: 15,
        fontFamily: "GilroyRegular",
      }
    }
  }
}