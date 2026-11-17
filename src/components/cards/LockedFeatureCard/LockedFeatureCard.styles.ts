import { app_colors, radius, spacing } from "../../../helpers/variables";

export const lockedFeatureCardStyles = {
  card: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard + 4,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  badge: {
    width: 38,
    height: 38,
    borderRadius: radius.badge38,
    backgroundColor: app_colors.primary.main,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  title: {
    fontFamily: "ZTNatureBold",
    fontSize: 16,
    color: app_colors.primary.main,
  },

  description: {
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    lineHeight: 11 * 1.4,
    color: app_colors.primary.medium,
  },

  cta: {
    marginTop: 4,
    alignSelf: "flex-start" as const,
  },
};
