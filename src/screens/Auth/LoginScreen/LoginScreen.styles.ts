import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const loginScreenStyles = {
  screen: {
    backgroundColor: app_colors.primary.main,
    flex: 1,
    padding: spacing.screen.horizontal,
    paddingTop: 20,

    backButton: {
      marginBottom: 50,
    },

    logoContainer: {
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,

      title: {
        color: app_colors.white,
        fontSize: 35,
        fontFamily: "ZTNatureBold",
      },

      slogan: {
        color: app_colors.accent.light,
        fontSize: 12,
        fontFamily: "DMMonoRegular",
      }
    },

    formContainer: {
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 10,
      marginTop: 50,

      button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: app_colors.accent.main,
        borderRadius: radius.badge32,
        paddingVertical: 15,

        text: {
          color: app_colors.white,
          fontSize: 16,
          fontFamily: "ZTNatureBold",
          textAlign: "center" as const,
        }
      },
    },

    forgotText: {
      color: app_colors.accent.light,
      fontSize: 12,
      fontFamily: "DMMonoRegular",
      marginTop: 20,
      alignSelf: "flex-end" as const,
    },

    bottomContainer: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "flex-end" as const,
      gap: 5,
      paddingBottom: 20,

      noAccountText:{
        color: withOpacity(app_colors.white, 0.7),
        fontSize: 12,
        fontFamily: "DMMonoRegular",

        link: {
          color: app_colors.accent.light,
          fontSize: 12,
          fontFamily: "DMMonoMedium",
          marginLeft: 10,
        }
      }
    }
  }
}