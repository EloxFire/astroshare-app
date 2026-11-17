import { app_colors, radius, spacing } from "../../../helpers/variables";

export const featuredSatelliteCardStyles = {
  card: {
    flexBasis: "48%" as const,
    flexGrow: 1,
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  topRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  },

  noradId: {
    fontFamily: "DMMonoRegular",
    fontSize: 8.5,
    color: app_colors.primary.medium,
  },

  texts: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 1,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 13.5,
      color: app_colors.primary.main,
    },

    subtitle: {
      fontFamily: "DMMonoRegular",
      fontSize: 9.5,
      color: app_colors.primary.medium,
    },
  },
};
