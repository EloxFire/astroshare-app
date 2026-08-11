import { app_colors, spacing, typography } from "../../helpers/variables";

export const screenHeaderStyles = {
  container: {
    flexDirection: "column" as const,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: app_colors.primary,

    homeHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
    },
    
    titleContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginTop: 20,

      title: {
        ...typography.ztNature.screenTitle,
        color: app_colors.white,
        whiteSpace: "pre-line" as const,
      }
    },
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
};
