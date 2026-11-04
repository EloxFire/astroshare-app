import { app_colors, radius } from "../../../../../../helpers/variables";

export const relatedModelsSectionStyles = {
  list: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 12,
  },

  card: {
    alignItems: "center" as const,
    width: 100,

    imageCircle: {
      width: 64,
      height: 64,
      borderRadius: radius.badge44 * 2,
      overflow: "hidden" as const,
      marginBottom: 6,
    },

    image: {
      width: "100%" as const,
      height: "100%" as const,
    },

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.primary.main,
      textAlign: "center" as const,
    },

    category: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },
};
