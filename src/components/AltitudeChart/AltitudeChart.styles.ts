import { app_colors, typography } from "../../helpers/variables";

export const altitudeChartStyles = {
  container: {
    display: "flex" as const,
    gap: 6,
  },

  // Pas de alignSelf: "center" ici : tant que la largeur mesurée (onLayout) n'est pas connue, le
  // LineChart n'est pas encore monté et ce conteneur n'a aucun contenu — avec alignSelf: "center"
  // il se réduirait à une largeur de 0 et ne grandirait plus jamais (onLayout ne refirerait pas).
  // Le stretch par défaut (hérité du parent flex column) lui donne sa largeur réelle dès le premier rendu.
  chart: {
    minHeight: 150, // = CHART_HEIGHT, évite un sursaut de layout le temps que le premier onLayout arrive
  },

  legend: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 16,

    item: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,

      swatch: {
        width: 14,
        height: 2,
        borderRadius: 1,
      },

      swatchDashed: {
        height: 0,
        borderTopWidth: 2,
        borderStyle: "dashed" as const,
      },

      label: {
        ...typography.dmMono.regular.rowMeta,
        fontSize: 9,
        color: app_colors.primary.medium,
      },
    },
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
        fontSize: 12
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
        fontSize: 12
      },
    },
  },
};
