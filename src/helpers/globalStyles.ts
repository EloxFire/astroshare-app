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

  button: {
    backgroundColor: app_colors.accent.main,
    padding: 10,
    borderRadius: radius.badge32,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 14,
      lineHeight: 16,
      color: app_colors.white,
    }
  },

  categoryTitle: {
    color: app_colors.primary.medium,
    fontSize: 14,
    fontFamily: "DMMonoMedium",
    textTransform: "uppercase" as const,
  },

  defaultCard: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    item: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingVertical: 10,
      paddingHorizontal: 10,

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.accent.light,
      }
    }
  },

  separator: {
    height: 1,
    backgroundColor: app_colors.accent.light,
  }
}