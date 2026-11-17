import { app_colors } from "../../../../helpers/variables";

export const launcherDetailsScreenStyles = {
  loader: {
    marginTop: 40,
  },

  notFound: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 30,
  },

  tags: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 6,
  },

  description: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.main,
    lineHeight: 20,
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 10,
  },
};
