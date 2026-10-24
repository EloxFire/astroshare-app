import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, gaps, spacing, typography, withOpacity } from "../../helpers/variables";

export const toolsScreenStyles = {
  screen: globalStyles.screen,
  content: {
    display: "flex" as const,
    flexDirection: "column" as const,
    padding: spacing.screenMargin,
    gap: 10,

    sectionTitle: {
      ...typography.dmMono.semiBold.sectionLabel,
      fontSize: 12,
    },

    toolsFilters: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    }
  }
};
