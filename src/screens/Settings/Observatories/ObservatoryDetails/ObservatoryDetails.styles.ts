import { app_colors, radius } from "../../../../helpers/variables";

export const observatoryDetailsStyles = {

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