import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing } from "../../../helpers/variables";

export const observatoriesScreenStyles = {
  screen: globalStyles.screen,
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,
  },

  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 200,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    }
  },

  useGpsContainer: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,

    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      title: {
        color: app_colors.white,
        fontFamily: "ZTNatureBold",
        fontSize: 14,
      },
      subtitle: {
        color: app_colors.white,
        fontFamily: "DMMonoMedium",
        fontSize: 10,
      },
    }
  },

  observatoriesList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 20,

    addObservatoryButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 10,
      padding: 10,
      borderWidth: 1,
      borderStyle: "dashed" as const,
      borderColor: app_colors.accent.main,
      borderRadius: radius.heroCard,

      text: {
        color: app_colors.accent.main,
        fontFamily: "ZTNatureBold",
        fontSize: 14,
      }
    },

    emptyListText: {
      color: app_colors.primary.medium,
      fontFamily: "DMMonoMedium",
      fontSize: 12,
    }
  }
}