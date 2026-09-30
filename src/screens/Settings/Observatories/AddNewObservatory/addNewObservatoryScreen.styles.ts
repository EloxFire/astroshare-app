import { app_colors, radius } from "../../../../helpers/variables";

export const addNewObservatoryScreenStyles = {
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 150,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    }
  },

  coordsContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    buttons: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
      alignItems: "flex-end" as const,

      button: {
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
          fontFamily: "ZTNatureBold",
          fontSize: 12,
        }
      }
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
  },

  caracteristicsContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    // Alignés par le bas : le SelectInput a un label au-dessus de son champ, pas le TabSwitch.
    // Avec l'étirement par défaut, le switch prendrait toute la hauteur label + champ.
    alignItems: "flex-end" as const,
    gap: 10,
  },

  equipmentsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    badges: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,
    }
  },

  tagsContainer: {
    display: "flex" as const,
    flexDirectino: "column" as const,
    gap: 10,
  },

  notesContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  imageContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderStyle: "dashed" as const,

    image: {
      width: "100%",
      height: 200,
      resizeMode: "cover" as const,
    }
  }
}