import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

const EQUIPMENTS_GRID_GUTTER = 10;

export const observatoryDetailsStyles = {

  image: {
    flex: 1,
    height: 200,
    width: "100%" as const,
    borderRadius: radius.heroCard,
    resizeMode: "cover" as const,
  },

  skyQualityContainer: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,

    body: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      padding: 10,
      gap: 10,

      bortleBadge: {
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        backgroundColor: app_colors.white,
        borderRadius: radius.badge44,
        width: 50,
        height: 50,
        gap: 5,
        padding: 10,

        label: {
          fontFamily: "DMMonoMedium",
          fontSize: 8,
          lineHeight: 8,
          color: app_colors.primary.main
        },

        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 24,
          lineHeight: 24,
          color: app_colors.primary.main
        }
      },

      observatoryInfos: {
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "flex-start" as const,
        
        bortleDescription: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.white
        },

        bortleValue:{
          fontFamily: "ZTNatureRegular",
          fontSize: 12,
          color: app_colors.yellow.main
        },

        bortleSource: {
          fontFamily: "ZTNatureRegular",
          fontSize: 10,
          color: app_colors.accent.light
        }
      },

    },

    bortleScale: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      padding: 10,
      gap: 3,

      bortleValue: {
        height: 8,
        backgroundColor: withOpacity(app_colors.white, 0.15),
        flex: 1,
        borderRadius: 8,

        active: {
          backgroundColor: app_colors.yellow.main
        }
      },

      scaleExtremes: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        paddingHorizontal: 10,
        marginBottom: 10,

        text: {
          fontFamily: "ZTNatureRegular",
          fontSize: 10,
          color: withOpacity(app_colors.white, 0.5)
        }
      }
    }
  },

  mapContainer: {
    borderTopLeftRadius: radius.heroCard,
    borderTopRightRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 120,
    width: "100%" as const,
  },

  equipmentsContainer: {
    ...globalStyles.defaultCard,

    title: {
      ...globalStyles.categoryTitle,
      fontSize: 12,
    },

    // Grille 2 colonnes avec une gouttière exacte, sans mesurer le conteneur (≠ onLayout dans
    // StepTwo) : chaque cellule fait 50% et porte la moitié de la gouttière en padding de chaque
    // côté ; le margin négatif de la grille annule cette demi-gouttière sur les bords extérieurs.
    // Le badge, lui, n'a aucune largeur : il remplit simplement sa cellule.
    grid: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      marginHorizontal: -EQUIPMENTS_GRID_GUTTER / 2,
      rowGap: EQUIPMENTS_GRID_GUTTER,

      cell: {
        width: "50%" as const,
        paddingHorizontal: EQUIPMENTS_GRID_GUTTER / 2,
      }
    },

    noEquipmentsText: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    }
  },

  notesContainer: {
    ...globalStyles.defaultCard,

    title: {
      ...globalStyles.categoryTitle,
      fontSize: 12,
    },

    text: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    },

    noNotesText: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    }
  },

  titleContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "flex-start" as const,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 28,
      color: app_colors.primary.main
    },

    subtitle: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: app_colors.primary.medium
    },

    tags: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-start" as const,
      alignItems: "center" as const,
      gap: 5,
      marginTop: 10
    }
  },

  actions: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,
  }
}