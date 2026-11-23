import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const objectDetailsScreenStyles = {
  // Fusion ScreenHeader + bloc attenant (même fond, arrondi seulement en bas) : même technique que
  // SatelliteDetailsScreen/ChecklistDetailsScreen (docs/agents-reference.md §4, ScreenHeader) —
  // pas de vraie image d'objet (content.images toujours vide côté API), donc pas
  // d'ImageHeaderScrollView ici, juste un halo décoratif (glow) en View plutôt qu'en SVG, pas besoin
  // d'un dégradé exact pour un simple aplat semi-transparent.
  heroHeader: {
    backgroundColor: app_colors.primary.main,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 20,
    borderBottomLeftRadius: radius.heroCard,
    borderBottomRightRadius: radius.heroCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 14,
    overflow: "hidden" as const,
    paddingTop: 20,

    badgesRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },

    name: {
      fontFamily: "ZTNatureBold",
      fontSize: 26,
      color: app_colors.white,
    },

    designations: {
      fontFamily: "DMMonoRegular",
      fontSize: 13,
      color: withOpacity(app_colors.white, 0.7),
    },
  },

  actionsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
  },

  statsGrid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,

    tile: {
      flexBasis: "48%" as const,
      flexGrow: 1,
      backgroundColor: withOpacity(app_colors.white, 0.1),
    },
  },

  description: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    lineHeight: 13 * 1.5,
    color: app_colors.primary.medium,
  },

  discoveryCard: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: 12,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,

    yearBadge: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: app_colors.primary.main,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      text: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.ambre.main,
      },
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "DMMonoMedium",
        fontSize: 11,
        textTransform: "uppercase" as const,
        color: app_colors.accent.main,
      },

      subtitle: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },
    },
  },

  notFound: {
    fontFamily: "DMMonoRegular",
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    marginTop: 20,
  },
};
