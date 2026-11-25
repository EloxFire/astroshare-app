import { app_colors, radius } from "../../../../../helpers/variables";

export const moonPathDiagramStyles = {
  container: {
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: 12,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  title: {
    fontFamily: "ZTNatureBold",
    fontSize: 12.5,
    color: app_colors.primary.main,
  },

  note: {
    fontFamily: "DMMonoRegular",
    fontSize: 9.5,
    color: app_colors.primary.medium,
  },

  svgWrap: {
    width: "100%" as const,
    aspectRatio: 220 / 180,
  },

  chips: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,

    chip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: "transparent",

      active: {
        borderColor: app_colors.accent.main,
        backgroundColor: app_colors.accent.main,
      },

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 10,
        color: app_colors.primary.main,

        active: {
          color: app_colors.white,
        },
      },
    },
  },

  legend: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,

    text: {
      fontFamily: "DMMonoRegular",
      fontSize: 9.5,
      color: app_colors.primary.medium,
    },
  },
};
