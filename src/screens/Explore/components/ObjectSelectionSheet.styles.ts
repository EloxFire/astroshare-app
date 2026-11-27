import { app_colors, radius } from "../../../helpers/variables";

export const objectSelectionSheetStyles = {
  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    iconBloc: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: app_colors.accent.light,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    textBloc: {
      flex: 1,

      name: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },

      category: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      },
    },
  },

  loader: {
    paddingVertical: 24,
  },

  statsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
  },

  fullSheetButton: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.heroCard,
    backgroundColor: app_colors.accent.light,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 13,
      color: app_colors.accent.main,
    },
  },
};
