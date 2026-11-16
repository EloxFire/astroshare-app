import { app_colors, radius, typography } from "../../../helpers/variables";

export const calculationTileStyles = {
  tile: {
    flexBasis: "47%" as const,
    flexGrow: 1,
    borderRadius: radius.mediumCard,
    padding: 12,
    gap: 10,
    position: "relative" as const,

    chevron: {
      position: "absolute" as const,
      top: 12,
      right: 12,
    },

    value: {
      fontFamily: "ZTNatureBold",
      fontSize: 24,
      color: app_colors.primary.main,
    },

    texts: {
      gap: 2,

      title: {
        color: app_colors.primary.main,
        fontFamily: "DMMonoMedium",
        fontSize: 12,
      },

      subtitle: {
        color: app_colors.primary.medium,
        fontFamily: "DMMonoRegular",
        fontSize: 10,
      },
    },
  },
};
