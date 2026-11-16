import { app_colors, typography } from "../../../helpers/variables";

// Styles partagés par les visualisations à jauge (grossissement, échantillonnage) : le même
// habillage texte au-dessus/en dessous de RangeBandGauge, pour rester visuellement cohérentes.
export const gaugeVisualizationStyles = {
  container: {
    gap: 20,

    rangeLabel: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      lineHeight: 16,
      color: app_colors.white,
      opacity: 0.8,
    },

    note: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      lineHeight: 16,
      color: app_colors.white,
      opacity: 0.8,
    },
  },
};
