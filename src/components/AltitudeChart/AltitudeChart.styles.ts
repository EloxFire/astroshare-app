import { app_colors, typography } from "../../helpers/variables";

export const altitudeChartStyles = {
  container: {
    display: "flex" as const,
    gap: 6,
  },

  chart: {
    alignSelf: "center" as const,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: app_colors.white,
  },

  dotCulmination: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  labelsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    paddingHorizontal: 4,

    edgeBloc: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 3,

      icon: {
        width: 14,
        height: 14,
        color: app_colors.primary.medium,
      },

      time: {
        ...typography.ztNature.numericValue,
        fontSize: 15,
        color: app_colors.primary.main,
      },

      caption: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },

    centerBloc: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 3,
      paddingTop: 17, // aligne le temps central avec ceux du lever/coucher (pas d'icône au-dessus)

      time: {
        ...typography.ztNature.numericValue,
        fontSize: 15,
        color: app_colors.primary.main,
      },

      caption: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },
  },
};
