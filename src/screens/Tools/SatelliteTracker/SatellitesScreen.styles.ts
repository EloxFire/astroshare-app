import { app_colors } from "../../../helpers/variables";

export const satellitesScreenStyles = {
  loader: {
    marginTop: 40,
  },

  stationsList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  featuredGrid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  },

  trackedList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  addButton: {
    borderWidth: 1,
    borderStyle: "dashed" as const,
    borderColor: app_colors.accent.main,
    borderRadius: 17,
    paddingVertical: 14,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 11,
      color: app_colors.accent.main,
    },
  },
};
