import { app_colors } from "../../../../../../helpers/variables";

export const checklistItemRowStyles = {
  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 10,

    indicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: app_colors.accent.light,
      backgroundColor: app_colors.white,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      checked: {
        backgroundColor: app_colors.accent.main,
        borderColor: app_colors.accent.main,
      },
    },

    label: {
      flex: 1,
      fontFamily: "DMMonoRegular",
      fontSize: 14,
      color: app_colors.primary.main,

      checked: {
        color: app_colors.primary.medium,
        textDecorationLine: "line-through" as const,
      },
    },

    remove: {
      marginLeft: 2,
    },
  },
};
