import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing } from "../../../../../../helpers/variables";

export const cameraDetailsStyles = {
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
    padding: 16,
    borderRadius: radius.heroCard,
    backgroundColor: app_colors.accent.light,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,

    iconBadge: {
      backgroundColor: app_colors.white,
      borderRadius: radius.badge44,
      padding: 10,
    },

    textBlock: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      gap: 2,

      kindLabel: {
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as const,
        color: app_colors.primary.main,
      },

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 25,
        color: app_colors.primary.main,
      },
    },
  },

  characteristicsGrid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },
  },

  usedInSection: {
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
