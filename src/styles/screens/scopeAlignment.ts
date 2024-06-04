import { app_colors } from "../../helpers/constants";

export const scopeAlignmentStyles = {
  content: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    // backgroundColor: 'red' as 'red',

    title: {
      color: app_colors.white,
      fontSize: 35,
      textAlign: "center" as "center",
      fontFamily: "GilroyBlack",
      textTransform: "uppercase" as "uppercase",
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 20,
      textAlign: "center" as "center",
      fontFamily: "GilroyMedium",
      marginBottom: 25,
    },

    infoText: {
      color: app_colors.white,
      fontSize: 15,
      textAlign: "center" as "center",
      fontFamily: "GilroyRegular",
    },

    toolContainer: {
      display: "flex" as "flex",
      justifyContent: "center" as "center",
      alignItems: "center" as "center",
      marginTop: 25,
    },

    button: {
      backgroundColor: app_colors.white,
      display: "flex" as "flex",
      justifyContent: "center" as "center",
      alignItems: "center" as "center",
      padding: 10,
      marginTop: 50,
      borderRadius: 10,
      width: '75%' as '75%',
      alignSelf: 'center' as 'center',
      
      text: {
        color: app_colors.black,
        fontSize: 15,
        fontFamily: "GilroyMedium",
      }
    }
  },
}