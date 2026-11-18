import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

// Même langage visuel que la carte radar météo en plein écran (WeatherRadarMap) : boutons ronds
// translucides sur fond sombre, panneau du bas en pilule arrondie avec marge latérale (pour ne pas
// gêner le geste "retour" du téléphone sur les bords de l'écran).
export const lightPollutionMapScreenStyles = {
  screen: {
    flex: 1,
    backgroundColor: app_colors.primary.main,
    position: "relative" as const,
  },

  map: {
    flex: 1,
  },

  backButton: {
    position: "absolute" as const,
    left: spacing.screen.horizontal,
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: withOpacity(app_colors.black, 0.55),
  },

  useLocationButton: {
    position: "absolute" as const,
    right: spacing.screen.horizontal,
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: withOpacity(app_colors.black, 0.55),
  },

  searchRow: {
    position: "absolute" as const,
    left: 60, // largeur du bouton retour + respiration
    right: 60,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
  },

  searchError: {
    alignSelf: "flex-start" as const,
    backgroundColor: withOpacity(app_colors.black, 0.6),
    borderRadius: radius.badge32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: app_colors.red.light,
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
  },

  resultCard: {
    position: "absolute" as const,
    left: 20,
    right: 20,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard + 2,
    backgroundColor: withOpacity(app_colors.black, 0.75),
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,

    loading: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },

    loadingText: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      color: withOpacity(app_colors.white, 0.8),
    },

    noData: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      color: withOpacity(app_colors.white, 0.8),
    },

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      bortleBadge: {
        width: 38,
        height: 38,
        borderRadius: radius.badge38,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.white,
        },
      },

      texts: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 1,

        indicator: {
          fontFamily: "ZTNatureBold",
          fontSize: 15,
          color: app_colors.white,
        },

        sqm: {
          fontFamily: "DMMonoRegular",
          fontSize: 10.5,
          color: withOpacity(app_colors.white, 0.7),
        },
      },
    },

    location: {
      fontFamily: "DMMonoMedium",
      fontSize: 11,
      textTransform: "uppercase" as const,
      color: withOpacity(app_colors.white, 0.6),
    },

    description: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,
      lineHeight: 10.5 * 1.4,
      color: withOpacity(app_colors.white, 0.75),
    },
  },
};
