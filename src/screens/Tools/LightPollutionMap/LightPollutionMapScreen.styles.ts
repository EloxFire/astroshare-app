import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

// Carte plein écran sur fond sombre (voir darkMapStyle.ts) avec des éléments d'interface clairs
// (blancs) posés par-dessus — inverse de WeatherRadarMap (contrôles sombres sur fond clair), pour
// coller à la maquette retravaillée de cet écran.
export const lightPollutionMapScreenStyles = {
  screen: {
    flex: 1,
    backgroundColor: app_colors.primary.main,
    position: "relative" as const,
  },

  map: {
    flex: 1,
  },

  topBar: {
    position: "absolute" as const,
    left: spacing.screen.horizontal,
    right: spacing.screen.horizontal,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },

  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: app_colors.white,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: app_colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  legendRow: {
    position: "absolute" as const,
    left: spacing.screen.horizontal,
    right: spacing.screen.horizontal,
    backgroundColor: app_colors.white,
    borderRadius: radius.searchField,
    paddingHorizontal: 14,
    paddingVertical: 10,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
    shadowColor: app_colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
    },

    label: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.primary.medium,
    },

    percentage: {
      fontFamily: "DMMonoMedium",
      fontSize: 10,
      color: app_colors.primary.main,
      minWidth: 30,
      textAlign: "right" as const,
    },

    bar: {
      flex: 1,
    },
  },

  searchError: {
    position: "absolute" as const,
    left: spacing.screen.horizontal + 54, // largeur du bouton retour + respiration
    right: spacing.screen.horizontal,
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
    left: spacing.screenMargin,
    right: spacing.screenMargin,
    bottom: 20,
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 14,
    shadowColor: app_colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,

    // Permet de revenir à "rien de sélectionné" (pas de marqueur, pas de carte) sans repasser par
    // une recherche ou un appui sur la carte.
    closeButton: {
      position: "absolute" as const,
      top: 14,
      right: 14,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: app_colors.accent.light,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    loading: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },

    loadingText: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      color: app_colors.primary.medium,
    },

    noData: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      color: app_colors.primary.medium,
    },

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,

      bortleBadge: {
        width: 52,
        height: 52,
        borderRadius: radius.badge44,
        backgroundColor: app_colors.accent.light,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 25,
          color: app_colors.accent.main,
        },
      },

      texts: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 1,

        location: {
          fontFamily: "DMMonoMedium",
          fontSize: 10.5,
          textTransform: "uppercase" as const,
          color: app_colors.accent.main,
        },

        indicator: {
          fontFamily: "ZTNatureBold",
          fontSize: 17,
          color: app_colors.primary.main,
        },

        sqm: {
          fontFamily: "DMMonoRegular",
          fontSize: 11,
          color: app_colors.primary.medium,
        },
      },
    },

    scaleSection: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 6,

      labels: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          fontFamily: "DMMonoRegular",
          fontSize: 9.5,
          color: app_colors.primary.medium,
        },
      },
    },

    description: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      lineHeight: 11 * 1.4,
      color: app_colors.primary.main,
    },

    badgesRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },
  },
};
