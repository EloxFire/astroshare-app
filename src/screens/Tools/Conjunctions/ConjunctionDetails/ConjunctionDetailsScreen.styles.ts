import { app_colors } from "../../../../helpers/variables";

export const conjunctionDetailsScreenStyles = {
  loader: {
    marginTop: 40,
  },

  notFound: {
    marginTop: 40,
    textAlign: "center" as const,
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  statsGrid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    statsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },
  },
};
