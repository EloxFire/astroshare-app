import { app_colors, radius } from "../../../helpers/variables";

export const unitsScreenStyles = {
  card: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    padding: 10,
    gap: 10,
  },

  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,

    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
      flex: 1,

      title: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 14,
      },

      description: {
        color: app_colors.primary.medium,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
      },
    },

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,
      paddingBottom: 10,
    }
  }
};
