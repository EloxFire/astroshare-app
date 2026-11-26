import { app_colors, radius } from "../../../../../helpers/variables";

export const wordOfTheDayCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 14,
  },

  row: {
    flexDirection: "row" as const,
    gap: 14,
    alignItems: "center" as const,
  },

  texts: {
    flex: 1,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  eyebrow: {
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: app_colors.yellow.main,
  },

  term: {
    fontFamily: "ZTNatureBold",
    fontSize: 28,
    color: app_colors.white,
  },

  definition: {
    fontFamily: "DMMonoRegular",
    fontSize: 12,
    lineHeight: 12 * 2,
    color: app_colors.accent.light,
  },

  illustration: {
    width: 110,
    height: 110,
  },

  cta: {
    alignSelf: "flex-start" as const,
    backgroundColor: app_colors.yellow.main,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,

    text: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.primary.main,
    },
  },
};
