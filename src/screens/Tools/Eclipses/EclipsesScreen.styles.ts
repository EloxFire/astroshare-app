import { app_colors } from "../../../helpers/variables";

export const eclipsesScreenStyles = {
  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginBottom: 20,
  },

  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  emptyState: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 20,
  },

  loader: {
    marginTop: 40,
  },
};
