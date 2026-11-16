import { app_colors, typography } from "../../../helpers/variables";

const FRAME_WIDTH = 150;
// Évite un cadre absurdement plat/haut pour un capteur très inhabituel (quasi carré ou très
// allongé) : la Lune reste lisible, le reste de la carte ne se déforme pas.
const MIN_FRAME_HEIGHT = 70;
const MAX_FRAME_HEIGHT = 220;

export const cameraFieldVisualizationStyles = {
  container: {
    alignItems: "center" as const,
    gap: 8,

    frame: {
      width: FRAME_WIDTH,
      borderRadius: 12,
      borderWidth: 1.5,
      borderStyle: "dashed" as const,
      borderColor: app_colors.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
    },

    caption: {
      ...typography.dmMono.regular.rowMeta,
      color: app_colors.white,
      opacity: 0.8,
    },

    note: {
      ...typography.dmMono.regular.footnote,
      color: app_colors.white,
      opacity: 0.8,
      textAlign: "center" as const,
    },
  },
};

export { FRAME_WIDTH, MIN_FRAME_HEIGHT, MAX_FRAME_HEIGHT };
