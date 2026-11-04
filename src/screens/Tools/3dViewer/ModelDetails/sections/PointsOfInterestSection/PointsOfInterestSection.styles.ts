import { app_colors, radius } from "../../../../../../helpers/variables";

export const pointsOfInterestSectionStyles = {
  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    overflow: "hidden" as const,
  },

  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 12,
    gap: 12,

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.accent.light,
    },

    numberCircle: {
      width: 26,
      height: 26,
      borderRadius: radius.badge44,
      backgroundColor: app_colors.primary.main,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 11,
        color: app_colors.white,
      },
    },

    textBlock: {
      flex: 1,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.primary.main,
      },

      description: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
        marginTop: 2,
      },
    },
  },
};
