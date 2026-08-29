import { app_colors, radius } from "../../../helpers/variables";

export const languageScreenStyles = {
  autoLanguageCard: {
    backgroundColor: app_colors.accent.light,
    padding: 10,
    borderRadius: radius.heroCard,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
      flex: 1,
    },
    
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 20,
    
    title: {
      color: app_colors.primary.main,
      fontFamily: "ZTNatureBold",
      fontSize: 14,
    },
    description: {
      color: app_colors.primary.medium,
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
    },
  },

  itemCardTitle: {
    color: app_colors.primary.main,
    fontFamily: "ZTNatureBold",
    fontSize: 16,
  },

  completenessBadge: {
    backgroundColor: app_colors.accent.main,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.badge32,

    text: {
      color: app_colors.yellow.light,
      fontFamily: "ZTNatureBold",
      fontSize: 12,
    }
  }
}