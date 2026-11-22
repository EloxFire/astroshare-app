import { app_colors, radius } from "../../../../helpers/variables";

export const searchResultRowStyles = {
  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    paddingVertical: 10,

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,
    },

    pictogram: {
      width: 40,
      height: 40,
      borderRadius: radius.badge44,
      backgroundColor: app_colors.accent.light,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },

    magnitude: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "flex-end" as const,
      gap: 1,

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },

      caption: {
        fontFamily: "DMMonoRegular",
        fontSize: 9,
        color: app_colors.primary.medium,
      },
    },
  },
};
