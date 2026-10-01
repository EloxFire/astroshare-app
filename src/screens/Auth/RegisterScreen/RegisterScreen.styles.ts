import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const registerScreenStyles = {
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

    termsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      gap: 10,
      marginTop: 20,

      text: {
        flex: 1,
        color: app_colors.primary.main,
        fontSize: 12,
        fontFamily: "DMMonoRegular",
        lineHeight: 12 * 1.4,

        bold: {
          fontFamily: "DMMonoMedium",
        }
      }
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
        color: app_colors.primary.main,
        fontSize: 12,
        fontFamily: "DMMonoRegular",

        link: {
          color: app_colors.accent.main,
          fontSize: 12,
          fontFamily: "DMMonoMedium",
          marginLeft: 10,
        }
      }
    }
  }
}