import { app_colors, radius } from "../../../../../helpers/variables";

export const glossaryCategoryPillsStyles = {
  list: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
  },

  pill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    active: {
      backgroundColor: app_colors.primary.main,
      borderColor: app_colors.primary.main,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    text: {
      fontFamily: "ZTNatureBold",
      fontSize: 12.5,
      color: app_colors.primary.main,

      active: {
        color: app_colors.white,
      },
    },
  },
};
