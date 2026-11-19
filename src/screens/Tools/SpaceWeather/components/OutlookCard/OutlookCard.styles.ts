import { app_colors, radius, typography } from "../../../../../helpers/variables";

export const outlookCardStyles = {
  row: {
    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,
      paddingHorizontal: 2,
      paddingVertical: 4,
    },

    item: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: 6,
      width: 56,
      paddingVertical: 10,
      borderRadius: radius.mediumCard,
      borderWidth: 1,

      date: {
        ...typography.dmMono.regular.rowMeta,
        fontSize: 9.5,
        color: app_colors.primary.medium,
      },

      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
      },

      kp: {
        fontFamily: "ZTNatureBold",
        fontSize: 11,
        color: app_colors.primary.main,
      },
    },
  },
};
