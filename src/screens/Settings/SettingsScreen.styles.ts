import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, radius, spacing, gaps, withOpacity } from "../../helpers/variables";

export const settingsScreenStyles = {
  screen: globalStyles.screen,
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,
  },


  accountCard: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 15,
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,

    profilePicture: {
      width: 60,
      height: 60,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: app_colors.yellow.light,
      marginRight: 10
    },
    
    textContainer: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      gap: 4,

      title: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: "ZTNatureBold",
      },
  
      subtitle: {
        color: app_colors.yellow.light,
        fontSize: 10,
        fontFamily: "DMMonoMedium",
      },

      description: {
        color: withOpacity(app_colors.white, 0.8),
        textTransform: "uppercase" as const,
        fontSize: 10,
        fontFamily: "DMMonoMedium",
      }
    },


    button: {
      width: 40,
      height: 40,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    }
  },

  settingsList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 20,

    // FIND IN GLOBAL STYLES NOW
    // categoryTitle: {
    //   color: app_colors.primary.medium,
    //   fontSize: 14,
    //   fontFamily: "DMMonoMedium",
    //   textTransform: "uppercase" as const,
    // },

    settingItem: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,

      content: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 10,

        title: {
          color: app_colors.primary.main,
          fontSize: 16,
          fontFamily: "ZTNatureBold",
        },

        subtitle: {
          color: app_colors.primary.medium,
          fontSize: 12,
          fontFamily: "DMMonoMedium",
        },
      }
    }
  }
};
