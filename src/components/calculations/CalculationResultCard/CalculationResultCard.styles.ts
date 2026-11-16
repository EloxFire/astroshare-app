import { app_colors, radius, spacing, typography } from "../../../helpers/variables";

export const calculationResultCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    gap: 14,

    eyebrow: {
      ...typography.dmMono.semiBold.sectionLabel,
      color: app_colors.white,
      opacity: 0.6,
      textTransform: "uppercase" as const,
    },

    value: {
      ...typography.ztNature.screenTitle,
      fontSize: 40,
      lineHeight: 40,
      color: app_colors.yellow.main,
    },

    separator: {
      height: 1,
      backgroundColor: app_colors.white,
      opacity: 0.16,
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
