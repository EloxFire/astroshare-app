import { app_colors, withOpacity } from "../../../helpers/variables";

export const passArcChartStyles = {
  container: {
    width: "100%" as const,
  },

  endLabels: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,

    bloc: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: 1,

      compass: {
        fontFamily: "DMMonoMedium",
        fontSize: 11,
        color: app_colors.primary.main,
      },

      time: {
        fontFamily: "DMMonoRegular",
        fontSize: 9,
        color: withOpacity(app_colors.primary.main, 0.6),
      },
    },
  },
};
