import { app_colors, radius, spacing } from "../../../../../helpers/variables";

export const nextEclipseCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard + 4,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    topRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
    },

    eyebrow: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      letterSpacing: 12 * 0.1,
      color: app_colors.yellow.main,
      textTransform: "uppercase" as const,
    },

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 18,
      color: app_colors.white,
      textTransform: "capitalize" as const,
    },

    subtitle: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: app_colors.yellow.light,
    },

    countdown: {
      alignSelf: "flex-start" as const,
      backgroundColor: app_colors.yellow.main,
      borderRadius: radius.pill,
      paddingVertical: 4,
      paddingHorizontal: 10,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 11,
        color: app_colors.primary.main,
      },
    },
  },
};
