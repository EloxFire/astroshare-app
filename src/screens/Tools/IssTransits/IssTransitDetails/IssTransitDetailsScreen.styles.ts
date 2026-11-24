import { app_colors, radius, spacing } from "../../../../helpers/variables";

export const issTransitDetailsScreenStyles = {
  loader: {
    marginTop: 40,
  },

  notFound: {
    marginTop: 40,
    textAlign: "center" as const,
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
  },

  // Même méthode que SatelliteDetailsScreen : bloc fusionné avec ScreenHeader (fond primary.main,
  // posé juste en dessous sans espace ni arrondi en haut), qui porte ici le schéma à l'échelle.
  heroHeader: {
    backgroundColor: app_colors.primary.main,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 20,
    paddingTop: 4,
    borderBottomLeftRadius: radius.heroCard,
    borderBottomRightRadius: radius.heroCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 4,
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  statsGrid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    statsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },
  },

  warningCard: {
    backgroundColor: app_colors.red.light,
    borderRadius: radius.mediumCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,

    text: {
      flex: 1,
      fontFamily: "DMMonoRegular",
      fontSize: 11.5,
      lineHeight: 11.5 * 1.4,
      color: app_colors.red.main,
    },
  },

  groundPathHint: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    lineHeight: 10.5 * 1.4,
    color: app_colors.primary.medium,
  },

  // Même rayon/hauteur que les autres cartes de l'app (StepOne, IssTransitsScreen).
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 220,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    },
  },
};
