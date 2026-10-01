import { app_colors, radius, spacing } from "../../../helpers/variables";

export const forgotPasswordScreenStyles = {
  screen: {
    backgroundColor: app_colors.background,
    flex: 1,
    padding: spacing.screen.horizontal,
    paddingTop: 50,

    logoContainer: {
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "flex-start" as const,
      alignItems: "flex-start" as const,

      iconContainer: {
        width: 70,
        height: 70,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        backgroundColor: app_colors.accent.light,
        borderRadius: radius.heroCard,
      },

      title: {
        color: app_colors.primary.main,
        fontSize: 35,
        fontFamily: "ZTNatureBold",
      },

      subtitle: {
        color: app_colors.primary.main,
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

    bottomContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      justifyContent: "center" as const,
      gap: 10,
      flex: 1,
      paddingBottom: 20,

      backToLoginText: {
        color: app_colors.accent.light,
        fontSize: 12,
        fontFamily: "DMMonoRegular",

        link: {
          color: app_colors.accent.main,
          fontSize: 12,
          fontFamily: "DMMonoRegular",
        }
      }
    }
  }
}