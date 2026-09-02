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

    heroCard: {
      backgroundColor: app_colors.white,
      borderRadius: radius.heroCard,
      padding: 10,
      gap: 10,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
  
      item: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        gap: 10,
  
        title: {
          color: app_colors.primary.medium,
          fontFamily: "ZTNatureRegular",
          fontSize: 14,
        },
  
        value: {
          color: app_colors.primary.main,
          fontFamily: "DMMonoMedium",
          fontSize: 14,
        },
  
        withBorder: {
          borderBottomWidth: 1,
          borderBottomColor: app_colors.primary.light,
          paddingBottom: 10,
        }
      }
    }
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