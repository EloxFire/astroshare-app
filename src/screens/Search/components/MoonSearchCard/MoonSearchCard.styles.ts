import { app_colors, radius, spacing, withOpacity } from "../../../../helpers/variables";

export const moonSearchCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      caption: {
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as const,
        color: withOpacity(app_colors.white, 0.6),
      },

      name: {
        fontFamily: "ZTNatureBold",
        fontSize: 22,
        color: app_colors.white,
      },

      phase: {
        fontFamily: "DMMonoMedium",
        fontSize: 13,
        color: app_colors.yellow.main,
      },
    },
  },

  statsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,

    stat: {
      flex: 1,
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 2,

      time: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.white,
      },

      caption: {
        fontFamily: "DMMonoRegular",
        fontSize: 10,
        color: withOpacity(app_colors.white, 0.6),
        textAlign: "center" as const,
      },
    },
  },

  fullMoonRow: {
    backgroundColor: withOpacity(app_colors.white, 0.08),
    borderRadius: radius.mediumCard,
    paddingVertical: 10,
    paddingHorizontal: 12,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,

    label: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: withOpacity(app_colors.white, 0.7),
    },

    value: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      color: app_colors.yellow.main,
    },
  },

  actionsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: radius.badge32,
      alignItems: "center" as const,

      primary: {
        backgroundColor: app_colors.yellow.main,
      },

      secondary: {
        backgroundColor: withOpacity(app_colors.white, 0.1),
      },

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 13,
      },

      primaryText: {
        color: app_colors.primary.main,
      },

      secondaryText: {
        color: app_colors.white,
      },
    },
  },

  detailsLink: {
    alignSelf: "center" as const,
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    color: withOpacity(app_colors.white, 0.6),
  },
};
