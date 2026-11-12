import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing, withOpacity } from "../../../../../../helpers/variables";

export const setupDetailsStyles = {
  topRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    marginBottom: 10,

    editButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.pill,
      paddingVertical: spacing.chip.vertical,
      paddingHorizontal: spacing.chip.horizontal + 4,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: app_colors.primary.main,
      },
    },
  },

  heroCard: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 16,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 4,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 24,
      color: app_colors.white,
    },

    description: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: withOpacity(app_colors.white, 0.7),
      marginTop: 4,
    },

    pieceCount: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      gap: 6,
      marginTop: 10,

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 28,
        lineHeight: 28,
        color: app_colors.ambre.main,
      },

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: withOpacity(app_colors.white, 0.7),
        marginBottom: 3,
      },
    },
  },

  compositionSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  categoryCard: {
    ...globalStyles.defaultCard,
    flexDirection: "column" as const,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },

      badge: {
        fontFamily: "DMMonoRegular",
        fontSize: 10,
        color: app_colors.primary.medium,
      },
    },

    chipsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,
    },

    chip: {
      backgroundColor: app_colors.primary.main,
      borderRadius: radius.pill,
      paddingVertical: spacing.chip.vertical,
      paddingHorizontal: spacing.chip.horizontal + 4,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: app_colors.white,
      },
    },

    emptyText: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    },
  },

  sessionsSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    noItems: {
      ...globalStyles.defaultCard,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
        textAlign: "center" as const,
      },
    },

    row: {
      ...globalStyles.defaultCard,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      iconBadge: {
        backgroundColor: app_colors.yellow.light,
        borderRadius: radius.badge32,
        padding: 10,
      },

      textBlock: {
        display: "flex" as const,
        flexDirection: "column" as const,
        flex: 1,
        gap: 2,

        title: {
          fontFamily: "ZTNatureBold",
          fontSize: 14,
          color: app_colors.primary.main,
        },

        subtitle: {
          fontFamily: "DMMonoRegular",
          fontSize: 10,
          color: app_colors.primary.medium,
        },
      },
    },
  },

  actions: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 10,

    deleteButton: {
      backgroundColor: app_colors.red.light,
      padding: 10,
      borderRadius: radius.badge32,
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 14,
        lineHeight: 16,
        color: app_colors.red.main,
      },
    },

    deleteWarning: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },
}
