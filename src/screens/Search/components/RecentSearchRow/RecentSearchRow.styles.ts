import { app_colors } from "../../../../helpers/variables";

export const recentSearchRowStyles = {
  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.primary.light,

    text: {
      fontFamily: "DMMonoRegular",
      fontSize: 13,
      color: app_colors.primary.main,
    },
  },
};
