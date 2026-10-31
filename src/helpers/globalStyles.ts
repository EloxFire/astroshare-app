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

    // Carte "liste de lignes clé/valeur" (ex: DayDetailModal, TimezoneScreen) — supprimée par erreur
    // lors du refactor qui a introduit `defaultCard` (ils ne couvrent pas le même besoin : celui-ci
    // a une structure de lignes internes, `defaultCard` est juste la coquille d'une carte simple).
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
    color: app_colors.primary.main,
    fontSize: 16,
    fontFamily: "ZTNatureBold",
    textTransform: "uppercase" as const,
  },

  categorySubtitle: {
    color: app_colors.primary.medium,
    fontSize: 14,
    fontFamily: "ZTNatureRegular",
  },

  defaultCard: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },

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