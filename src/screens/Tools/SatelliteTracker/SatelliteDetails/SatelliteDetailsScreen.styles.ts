import { app_colors, radius, spacing } from "../../../../helpers/variables";

export const satelliteDetailsScreenStyles = {
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

  tags: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
    flexWrap: "wrap" as const,
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  statsGrid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,

    tile: {
      flexBasis: "47%" as const,
      flexGrow: 1,
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.mediumCard,
      padding: spacing.toolCard,

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 18,
        color: app_colors.primary.main,
      },

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 9.5,
        color: app_colors.primary.medium,
        marginTop: 2,
      },
    },
  },

  nextPassCard: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard + 4,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    topRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },

    label: {
      fontFamily: "DMMonoMedium",
      fontSize: 9.5,
      letterSpacing: 9.5 * 0.1,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 18,
      color: app_colors.primary.main,
    },
  },

  noPasses: {
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    color: app_colors.primary.medium,
  },

  orbitRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
  },

  orbitTile: {
    flex: 1,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: spacing.toolCard,

    value: {
      fontFamily: "ZTNatureBold",
      fontSize: 17,
      color: app_colors.primary.main,
    },

    label: {
      fontFamily: "DMMonoRegular",
      fontSize: 9.5,
      color: app_colors.primary.medium,
      marginTop: 2,
    },
  },

  orbitNote: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    lineHeight: 10.5 * 1.4,
    color: app_colors.primary.medium,
  },
};
