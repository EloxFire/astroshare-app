import { app_colors, typography } from "../../../helpers/variables";

const CIRCLE_SIZE = 140;

export const moonFieldVisualizationStyles = {
  container: {
    alignItems: "center" as const,
    gap: 8,

    circle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      borderWidth: 1.5,
      borderStyle: "dashed" as const,
      borderColor: app_colors.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
    },

    caption: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
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

export { CIRCLE_SIZE };
