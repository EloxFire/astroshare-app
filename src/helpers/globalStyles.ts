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

  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,
    paddingBottom: 100,
  },

  input: {
    borderWidth: 1,
    borderColor: withOpacity(app_colors.grey, 0.5),
    borderRadius: radius.searchField,
    paddingVertical: spacing.chip.vertical,
    paddingHorizontal: spacing.chip.horizontal,
    ...typography.dmMono.regular.searchPlaceholder,
  },

  categoryTitle: {
    color: app_colors.primary.medium,
    fontSize: 14,
    fontFamily: "DMMonoMedium",
    textTransform: "uppercase" as const,
  },
}