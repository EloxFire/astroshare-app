import { app_colors, radius, spacing } from "../../../../helpers/variables";

export const lunarEclipseDetailsScreenStyles = {
  screen: {
    flex: 1,
    backgroundColor: app_colors.primary.main,
    position: "relative" as const,
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
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: app_colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  searchInputRow: {
    position: "absolute" as const,
    left: spacing.screen.horizontal,
    right: spacing.screen.horizontal,
  },

  loaderOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  idleCard: {
    position: "absolute" as const,
    left: spacing.screenMargin,
    right: spacing.screenMargin,
    bottom: 20,
    backgroundColor: app_colors.background,
    borderRadius: radius.heroCard,
    padding: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
    shadowColor: app_colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,

    type: {
      fontFamily: "ZTNatureBold",
      fontSize: 17,
      color: app_colors.primary.main,
    },
  },

  hint: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
  },

  locationLine: {
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    color: app_colors.primary.medium,
  },

  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,

    iconRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1,
      borderStyle: "dashed" as const,
      borderColor: app_colors.primary.medium,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,
    },

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 21,
      color: app_colors.primary.main,
    },
  },

  // Titre "phrase" plein-largeur (ex: "La Lune se lève déjà éclipsée") remplaçant l'en-tête
  // icône+pourcentage quand la Lune n'est au-dessus de l'horizon qu'une partie de l'éclipse.
  sentenceTitle: {
    fontFamily: "ZTNatureBold",
    fontSize: 19,
    lineHeight: 19 * 1.2,
    color: app_colors.primary.main,
  },

  metaRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,

    altitude: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,
      color: app_colors.primary.medium,
    },

    time: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,
      color: app_colors.primary.medium,
    },
  },

  statsGrid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },

  visibilityBadge: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: spacing.toolCard,

    text: {
      flex: 1,
      fontFamily: "DMMonoRegular",
      fontSize: 11.5,
      lineHeight: 11.5 * 1.4,
      color: app_colors.primary.main,
    },
  },

  // Liste des contacts (phases) — rangées pleine largeur, contrairement à la grille de tuiles du
  // solaire (jusqu'à 7 contacts ici, une grille serait trop dense).
  contactList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
  },

  contactRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.mediumCard,
    backgroundColor: app_colors.white,

    dimmed: {
      backgroundColor: "transparent",
    },

    highlighted: {
      backgroundColor: app_colors.ambre.main,
    },

    label: {
      flex: 1,
      fontFamily: "ZTNatureBold",
      fontSize: 13.5,
      color: app_colors.primary.main,

      dimmed: {
        color: app_colors.primary.medium,
      },
    },

    meta: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,
      color: app_colors.primary.medium,
    },

    time: {
      fontFamily: "ZTNatureBold",
      fontSize: 15,
      color: app_colors.primary.main,
      marginLeft: 8,

      dimmed: {
        color: app_colors.primary.medium,
      },
    },
  },

  ctaRow: {
    flexDirection: "row" as const,
    gap: 10,

    primary: {
      flex: 1,
      backgroundColor: app_colors.accent.main,
      borderRadius: radius.pill,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 16,

      text: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.white,
      },
    },

    secondary: {
      width: 56,
      borderRadius: radius.mediumCard,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      backgroundColor: app_colors.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
  },
};
