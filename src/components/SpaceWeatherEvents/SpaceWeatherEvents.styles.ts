import { app_colors, radius, typography } from "../../helpers/variables";

export const spaceWeatherEventsStyles = {
  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  noEvents: {
    ...typography.dmMono.regular.cardBody,
    fontSize: 12,
    color: app_colors.primary.medium,
  },

  card: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.heroCard,
    padding: 12,

    badge: {
      width: 38,
      height: 38,
      borderRadius: radius.badge38,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      text: {
        ...typography.dmMono.semiBold.badge,
        fontSize: 10,
        color: app_colors.primary.main,
      },
    },

    badgeAlert: {
      backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.accent.main,
    },

    content: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.primary.main,
      },

      subtitle: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.main,
        fontSize: 12,
      },
    },
  },
};
