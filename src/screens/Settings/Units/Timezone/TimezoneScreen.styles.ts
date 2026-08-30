import { app_colors } from "../../../../helpers/variables";

export const timezoneScreenStyles = {
  itemText: {
    color: app_colors.primary.main,
    fontFamily: "ZTNatureRegular",
    fontSize: 14,
  },
  searchContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
};
