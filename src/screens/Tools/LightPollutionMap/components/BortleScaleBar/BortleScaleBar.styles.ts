import { app_colors } from "../../../../../helpers/variables";

export const bortleScaleBarStyles = {
  dotsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 4,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: app_colors.primary.light,

    active: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: app_colors.primary.main,
    },
  },

  bar: {
    width: "100%" as const,
    overflow: "hidden" as const,
  },
};
