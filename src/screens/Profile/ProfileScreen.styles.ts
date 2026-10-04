import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, spacing, withOpacity } from "../../helpers/variables";

export const profileScreenStyles = {
  screen: {
    ...globalStyles.screen,
    paddingBottom: 50
  },
  
  
  header: {
    padding: spacing.screen.horizontal,
    height: 230,
    backgroundColor: app_colors.primary.main,
    display: "flex" as const,
    flexDirection: "column" as const,

    navigation: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },

    content: {
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "flex-start" as const,
      alignItems: "center" as const,
      flex: 1,

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
    }
  },

  content: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};
