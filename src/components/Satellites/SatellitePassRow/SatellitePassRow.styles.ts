import { app_colors, withOpacity } from "../../../helpers/variables";

export const satellitePassRowStyles = {
  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.grey,
  },

  dateBloc: {
    width: 76,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 1,

    date: {
      fontFamily: "ZTNatureBold",
      fontSize: 12,
      color: app_colors.primary.main,
    },

    compassRange: {
      fontFamily: "DMMonoRegular",
      fontSize: 8.5,
      color: app_colors.primary.medium,
    },
  },

  barBloc: {
    flex: 1,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 3,

    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: withOpacity(app_colors.primary.main, 0.12),
      overflow: "hidden" as const,

      fill: {
        height: 4,
        borderRadius: 2,
        backgroundColor: app_colors.accent.main,
      },
    },

    duration: {
      fontFamily: "DMMonoRegular",
      fontSize: 8.5,
      color: app_colors.primary.medium,
    },
  },

  elevation: {
    fontFamily: "ZTNatureBold",
    fontSize: 15,
    color: app_colors.primary.main,
    width: 36,
    textAlign: "right" as const,
  },
};
