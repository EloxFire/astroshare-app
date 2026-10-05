import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, radius, spacing, withOpacity } from "../../helpers/variables";

export const profileScreenStyles = { 
  header: {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "flex-start" as const,
    alignItems: "center" as const,
    backgroundColor: app_colors.primary.main,
    paddingBottom: 10,

    profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: app_colors.yellow.light,
    },

    name: {
      fontSize: 18,
      fontFamily: "ZTNatureBold",
      color: app_colors.white,
      textTransform: "uppercase" as const,
    },

    subInfos: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 10,

      subInfo: {
        fontSize: 10,
        fontFamily: "DMMonoRegular",
        color: withOpacity(app_colors.white, 0.8),
      }
    }
  },

  content: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingTop: 20,

    recap: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
      backgroundColor: app_colors.yellow.light,
      padding: 10,
      borderRadius: radius.heroCard,

      item: {
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "flex-start" as const,
        flex: 1,
        // backgroundColor: app_colors.yellow.main,

        value: {
          fontSize: 20,
          fontFamily: "ZTNatureBold",
          color: app_colors.primary.main,
        },

        label: {
          fontSize: 10,
          fontFamily: "DMMonoRegular",
          color: withOpacity(app_colors.primary.main, 0.8),
          textTransform: "uppercase" as const,
        }
      },

      separator: {
        height: "100%" as const,
        width: 1,
        backgroundColor: app_colors.primary.main,
      }
    },

    bio: {
      backgroundColor: app_colors.accent.light,
      padding: 10,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "flex-start" as const,
      alignItems: "flex-start" as const,
      gap: 10,

      title: {
        fontSize: 12,
        fontFamily: "DMMonoRegular",
        color: withOpacity(app_colors.primary.main, 0.8),
        textTransform: "uppercase" as const,
      },

      text: {
        fontSize: 10,
        fontFamily: "DMMonoRegular",
        color: app_colors.primary.main,
      }
    },

    editButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 10,
      backgroundColor: app_colors.accent.main,
      padding: 15,
      borderRadius: radius.badge32,

      text: {
        fontSize: 14,
        fontFamily: "DMMonoMedium",
        color: app_colors.white,
      }
    },
    changePasswordButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,

      text: {
        fontSize: 14,
        fontFamily: "DMMonoMedium",
        color: app_colors.accent.main,
      }
    },
    logoutButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 10,
      backgroundColor: app_colors.red.main,
      padding: 15,
      borderRadius: radius.badge32,

      text: {
        fontSize: 14,
        fontFamily: "DMMonoMedium",
        color: app_colors.white,
      }
    }
  },
};
