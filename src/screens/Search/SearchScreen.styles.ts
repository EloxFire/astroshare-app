import { globalStyles } from "../../helpers/globalStyles";
import { app_colors } from "../../helpers/variables";

export const searchScreenStyles = {
  screen: globalStyles.screen,

  tonightGrid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  },

  emptyResults: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 20,
  },
};
