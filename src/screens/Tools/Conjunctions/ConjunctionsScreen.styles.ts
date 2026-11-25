import { app_colors, radius, spacing } from "../../../helpers/variables";

export const conjunctionsScreenStyles = {
  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  objectsRow: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  locationSummary: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,

    text: {
      flex: 1,
      fontFamily: "ZTNatureBold",
      fontSize: 15,
      color: app_colors.primary.main,
    },
  },

  locationActions: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 16,

    link: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      color: app_colors.accent.main,
    },
  },

  // Même rayon/hauteur que la carte de StepOne / SatelliteTransitsScreen.
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 180,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    },
  },

  disclaimer: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    lineHeight: 10.5 * 1.4,
    color: app_colors.primary.medium,
  },

  staticPairCard: {
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 4,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 15,
      color: app_colors.primary.main,
    },

    description: {
      fontFamily: "DMMonoRegular",
      fontSize: 11.5,
      lineHeight: 11.5 * 1.4,
      color: app_colors.primary.main,
    },
  },

  explanationCard: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    item: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.primary.light,
        paddingBottom: 10,
      },

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.primary.main,
      },

      description: {
        fontFamily: "DMMonoRegular",
        fontSize: 11.5,
        lineHeight: 11.5 * 1.4,
        color: app_colors.primary.medium,
      },
    },
  },

  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  emptyState: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 20,
  },

  loader: {
    marginTop: 40,
  },
};
