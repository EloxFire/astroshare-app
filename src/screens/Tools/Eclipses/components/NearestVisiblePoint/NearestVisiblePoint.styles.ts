import { app_colors, radius } from "../../../../../helpers/variables";

export const nearestVisiblePointStyles = {
  button: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: 12,

    text: {
      flex: 1,
      fontFamily: "DMMonoRegular",
      fontSize: 11.5,
      color: app_colors.primary.main,
    },
  },

  meta: {
    fontFamily: "DMMonoRegular",
    fontSize: 9.5,
    color: app_colors.primary.medium,
  },
};
