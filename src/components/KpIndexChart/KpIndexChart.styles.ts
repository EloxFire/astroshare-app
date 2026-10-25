import { app_colors, typography, withOpacity } from "../../helpers/variables";

const CHART_HEIGHT = 90;

export const kpIndexChartStyles = {
  container: {
    marginTop: 16,
  },

  chartRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
  },

  yAxis: {
    height: CHART_HEIGHT,
    width: 16,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,

    // Les graduations [9,6,3,0] tombent exactement sur les hauteurs de barres (hauteur = kp/9 *
    // CHART_HEIGHT, échelle linéaire) puisqu'elles sont réparties par justifyContent plutôt que
    // positionnées en pourcentage — même hauteur totale, même répartition, donc alignement garanti
    // sans calcul de position séparé.
    tick: {
      ...typography.dmMono.regular.rowMeta,
      fontSize: 9,
      lineHeight: 10,
      color: withOpacity(app_colors.white, 0.45),
    },
  },

  barsArea: {
    flex: 1,
    height: CHART_HEIGHT,
    position: "relative" as const,
  },

  bars: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    height: "100%" as const,
    gap: 6,
  },

  column: {
    flex: 1,
    height: "100%" as const,
    display: "flex" as const,
    justifyContent: "flex-end" as const,
  },

  bar: {
    width: "100%" as const,
    borderRadius: 3,
  },

  barPast: {
    backgroundColor: withOpacity(app_colors.white, 0.3),
  },

  barCurrent: {
    backgroundColor: app_colors.yellow.main,
    borderWidth: 1.5,
    borderColor: app_colors.white,
  },

  // Remplissage plein mais semi-transparent plutôt qu'une bordure pointillée : sur une barre courte
  // (Kp faible), une bordure pointillée se résume visuellement à ses bords haut/bas accolés — un
  // trait plat, pas une barre. L'opacité réduite reste lisible comme "barre" à n'importe quelle
  // hauteur et communique clairement "prévision, pas encore observé".
  barForecast: {
    backgroundColor: withOpacity(app_colors.yellow.main, 0.4),
  },

  barEmpty: {
    height: 3,
    backgroundColor: withOpacity(app_colors.white, 0.08),
  },

  // Seuil officiel NOAA G1 (tempête géomagnétique mineure, Kp ≥ 5) — repère fixe, indépendant des
  // données chargées.
  stormLine: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: app_colors.red.main,
    opacity: 0.6,
  },

  stormLineLabel: {
    position: "absolute" as const,
    right: 0,
    ...typography.dmMono.regular.rowMeta,
    fontSize: 8,
    color: app_colors.red.main,
  },

  xAxis: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 6,
    marginTop: 6,
    marginLeft: 16 + 8, // aligné sous barsArea : largeur de yAxis + son gap avec chartRow

    column: {
      flex: 1,
      display: "flex" as const,
      alignItems: "center" as const,
    },

    label: {
      ...typography.dmMono.regular.rowMeta,
      fontSize: 9,
      color: withOpacity(app_colors.white, 0.55),
    },

    labelCurrent: {
      ...typography.dmMono.regular.rowMeta,
      fontSize: 9,
      color: app_colors.yellow.main,
    },
  },

  legend: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 14,
    marginTop: 10,

    item: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,

      swatch: {
        width: 8,
        height: 8,
        borderRadius: 2,
      },

      label: {
        ...typography.dmMono.regular.rowMeta,
        fontSize: 9,
        color: withOpacity(app_colors.white, 0.6),
      },
    },
  },
};
