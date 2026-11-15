import { app_colors, radius, spacing, typography, withOpacity } from "../../../helpers/variables";

export const infoTooltipStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: withOpacity(app_colors.black, 0.4),
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: spacing.screenMargin,
  },

  card: {
    width: "100%" as const,
    maxWidth: 340,
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 16,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      justifyContent: "space-between" as const,
      gap: 10,

      title: {
        flex: 1,
        color: app_colors.primary.main,
        ...typography.ztNature.cardTitle,
        fontSize: 16,
      },
    },

    description: {
      fontFamily: "DMMonoRegular",
      fontSize: 13,
      lineHeight: 18,
      color: app_colors.primary.medium,
    },
  },
}
