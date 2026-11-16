import { app_colors } from "../../../helpers/variables";

export const spaceLaunchesScreenStyles = {
  loader: {
    marginTop: 40,
  },

  noResults: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 30,
  },
};
