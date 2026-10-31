import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";

export const monthlyIlluminationChartStyles = {
  card: {
    ...globalStyles.defaultCard,
  },

  // Même raison que AltitudeChart.styles : pas de alignSelf:"center", pour que la largeur réelle
  // (onLayout) remonte dès le premier rendu plutôt que de se bloquer à 0.
  chart: {
    minHeight: 150,
  },

  bestWindow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingTop: 2,

    text: {
      color: app_colors.primary.medium,
      fontFamily: "DMMonoRegular",
      fontSize: 11,
    },

    value: {
      color: app_colors.accent.main,
      fontFamily: "DMMonoMedium",
      fontSize: 11,
    },
  },
};
