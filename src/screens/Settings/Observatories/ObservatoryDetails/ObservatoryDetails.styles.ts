import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const observatoryDetailsStyles = {

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
          fontFamily: "ZTNature",
          fontSize: 12,
          color: app_colors.yellow.main
        },

        bortleSource: {
          fontFamily: "ZTNature",
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
          fontFamily: "ZTNature",
          fontSize: 10,
          color: withOpacity(app_colors.white, 0.5)
        }
      }
    }
  },

  locationContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 10,

    mapContainer: {
      display: "flex" as const,
      flex: 1,
      borderRadius: radius.heroCard,
      overflow: "hidden" as const,

      map: {
        height: 200,
        width: "100%" as const,
      }
    },

    // flex:1 (comme mapContainer) pour un partage strict 50/50 de la largeur quand les deux
    // sont affichés côte à côte — sans ça, l'image ne prend que sa largeur intrinsèque.
    image: {
      flex: 1,
      height: 200,
      width: "100%" as const,
      borderRadius: radius.heroCard,
      resizeMode: "cover" as const,
    }
  },

  titleContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "flex-start" as const,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 22,
      color: app_colors.primary.main
    },

    subtitle: {
      fontFamily: "ZTNature",
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