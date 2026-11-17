import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const satelliteStationCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard + 4,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  topRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    justifyContent: "space-between" as const,
  },

  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.badge44,
    backgroundColor: withOpacity(app_colors.white, 0.12),
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  liveBadge: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,

    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: app_colors.red.main,
    },

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 9,
      letterSpacing: 9 * 0.08,
      color: withOpacity(app_colors.white, 0.85),
    },
  },

  texts: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 2,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 19,
      color: app_colors.white,
    },

    subtitle: {
      fontFamily: "DMMonoRegular",
      fontSize: 11,
      color: withOpacity(app_colors.white, 0.65),
    },
  },

  nextPassBadge: {
    alignSelf: "flex-start" as const,
    backgroundColor: withOpacity(app_colors.white, 0.12),
    borderRadius: radius.pill,
    paddingVertical: spacing.badge.vertical + 2,
    paddingHorizontal: spacing.badge.horizontal + 4,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 9.5,
      color: app_colors.yellow.main,
    },
  },
};
