import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors, radius, withOpacity } from "../../../../../helpers/variables";

export const checklistCardStyles = {
  card: {
    ...globalStyles.defaultCard,
    flexBasis: "48%" as const,
    flexGrow: 1,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    padding: 12,

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      name: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.primary.main,
      },

      description: {
        fontFamily: "DMMonoRegular",
        fontSize: 10.5,
        color: app_colors.primary.medium,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 10.5,
        color: app_colors.primary.medium,
      },
    },

    ring: {
      value: {
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        color: app_colors.primary.main,
      },
    },

    resetButton: {
      width: 28,
      height: 28,
      borderRadius: radius.badge32,
      backgroundColor: withOpacity(app_colors.accent.main, 0.1),
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
  },

  addCard: {
    flexBasis: "48%" as const,
    flexGrow: 1,
  },

  grid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  },
};
