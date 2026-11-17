import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const launchDetailsScreenStyles = {
  statusRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
  },

  followTimings: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 20,
  },

  probabilityCard: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: 14,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,

    value: {
      fontFamily: "ZTNatureBold",
      fontSize: 18,
      color: app_colors.primary.main,
    },

    text: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.primary.main,
      },

      description: {
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      },
    },
  },

  missionCard: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    padding: 10,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginBottom: 20,

    tags: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 6,
    },

    description: {
      fontFamily: "ZTNatureRegular",
      fontSize: 13,
      color: app_colors.primary.main,
      lineHeight: 19,
    },
  },

  rocketRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "stretch" as const,
  },

  // Carte sombre "lanceur" — style inspiré des ValueCard à fond foncé (ex: TelescopeDetails,
  // rapport F/D) : un repère chiffré bien visible plutôt qu'une simple ligne de description.
  rocketCard: {
    flex: 1,
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 14,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    gap: 10,

    name: {
      fontFamily: "ZTNatureBold",
      fontSize: 18,
      color: app_colors.white,
    },

    subtitle: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: withOpacity(app_colors.white, 0.6),
      marginTop: 2,
    },

    footer: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 4,
    },

    highlight: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.ambre.main,
    },

    link: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.white,
    },
  },

  // Carte claire "agence" — même esprit, fond accent pour trancher avec la carte lanceur, avatar
  // rond (logo ou initiales) et un lien d'action en pied de carte plutôt qu'une simple description.
  agencyCard: {
    flex: 1,
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.heroCard,
    padding: 14,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    gap: 10,

    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: app_colors.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,

      logo: {
        width: "100%" as const,
        height: "100%" as const,
      },

      text: {
        fontFamily: "ZTNatureBold",
        fontSize: 11,
        color: app_colors.primary.main,
      },
    },

    name: {
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      color: app_colors.primary.main,
    },

    subtitle: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
      marginTop: 2,
    },

    link: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.accent.main,
    },
  },
};
