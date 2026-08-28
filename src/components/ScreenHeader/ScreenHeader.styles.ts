import { app_colors, spacing, typography } from "../../helpers/variables";

export const screenHeaderStyles = {
  container: {
    flexDirection: "column" as const,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: app_colors.primary.main,

    light: {
      backgroundColor: app_colors.background,
    },

    homeHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
    },
    
    titleContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginTop: 10,

      title: {
        ...typography.ztNature.screenTitle,
        color: app_colors.white,
        whiteSpace: "pre-line" as const,

        light: {
          fontSize: 20,
          color: app_colors.primary.main,
        }
      },

      subtitle: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
        color: app_colors.primary.medium,
        whiteSpace: "pre-line" as const,

        light: {
          fontSize: 16,
          color: app_colors.primary.main,
        }
      }
    },
  },
  backButton: {
    width: 24,
    height: 24,
    borderRadius: 18,
    marginRight: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
};
