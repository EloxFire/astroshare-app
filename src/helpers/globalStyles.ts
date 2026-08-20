import { StatusBar } from "expo-status-bar";
import { app_colors, gaps, radius, spacing, typography, withOpacity } from "./variables";

export const globalStyles = {
  screen: {
    backgroundColor: app_colors.background,
    flex: 1,
    content: {
      padding: spacing.screen.horizontal,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: gaps.sectionSeparator.after,
    }
  },

  input: {
    borderWidth: 1,
    borderColor: withOpacity(app_colors.grey, 0.5),
    borderRadius: radius.searchField,
    paddingVertical: spacing.chip.vertical,
    paddingHorizontal: spacing.chip.horizontal,
    ...typography.dmMono.regular.searchPlaceholder,
  }
}