import { app_colors, radius } from "../../../../helpers/variables";

export const addNewObservatoryScreenStyles = {
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 250,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    }
  },

  nextButton: {
    backgroundColor: app_colors.accent.main,
    padding: 10,
    borderRadius: radius.badge32,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  validateButton: {
    backgroundColor: app_colors.accent.main,
    padding: 10,
    borderRadius: radius.badge32,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    text: {
      color: app_colors.white,
      fontFamily: "DMMonoMedium",
      fontSize: 16,
    }
  },

  editButton: {
    color: app_colors.accent.main,
    fontFamily: "DMMonoMedium",
    fontSize: 14,
    textTransform: "uppercase" as const,
  }
}