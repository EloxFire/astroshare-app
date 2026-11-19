import { app_colors } from "../../../../../helpers/variables";

// Pas de coquille blanche (contrairement aux autres sections de l'écran, en globalStyles.defaultCard) :
// 3 NoaaScaleCard déjà bien délimitées chacune, une carte autour aurait fait doublon.
export const noaaScalesCardStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  link: {
    color: app_colors.accent.main,
    fontFamily: "DMMonoRegular",
    fontSize: 12,
  },

  scales: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
  },
};
