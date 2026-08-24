import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, gaps, spacing, typography, withOpacity } from "../../helpers/variables";

export const toolsScreenStyles = {
  screen: globalStyles.screen,
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,

    sectionTitle: {
      ...typography.dmMono.semiBold.sectionLabel,
      fontSize: 12,
    },

    pinnedTools: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      paddingBottom: gaps.sectionSeparator.after,
      borderBottomWidth: 1,
      borderBottomColor: withOpacity(app_colors.primary.main, 0.5),
      marginBottom: gaps.sectionSeparator.after,
      paddingTop: gaps.sectionSeparator.after,
    },

    toolSection: {
      display: "flex" as const,
      gap: gaps.sectionSeparator.after,
      flexDirection: "column" as const,
      borderBottomWidth: 1,
      borderBottomColor: withOpacity(app_colors.primary.main, 0.5),
      paddingBottom: gaps.sectionSeparator.after,
      marginBottom: gaps.sectionSeparator.after,

      toolsList: {
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 5,

        row: {
          display: "flex" as const,
          flexDirection: "row" as const,
          justifyContent: "flex-start" as const,
        }
      }
    }
  }
};
