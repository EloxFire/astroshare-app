import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, gaps, spacing, typography, withOpacity } from "../../helpers/variables";

export const toolsScreenStyles = {
  screen: globalStyles.screen,
  content: {
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
      gap: gaps.sectionSeparator.after,
      paddingBottom: gaps.sectionSeparator.after,
      borderBottomWidth: 1,
      borderBottomColor: withOpacity(app_colors.primary.main, 0.5),
    }
  }
};
