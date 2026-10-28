import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const weatherSummaryStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      title: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: "ZTNatureBold",
        textTransform: "uppercase" as const
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: "DMMonoRegular",
      },

      button: {
        padding: 5,
        backgroundColor: withOpacity(app_colors.white, 0.2),
        borderRadius: radius.badge32,
      }
    },

    body: {
      marginTop: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      // "stretch" (plutôt que "flex-end") : les deux conteneurs prennent toute la hauteur de la
      // ligne, pas seulement celle de leur propre contenu.
      alignItems: "stretch" as const,
      // backgroundColor: withOpacity(app_colors.yellow.light, 0.2),

      iconContainer: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 15,
        // Pas de flex:1 ici : une largeur fixe (un peu plus large que l'icône, pour laisser respirer
        // la légende) plutôt qu'un partage 50/50 avec `conditions` — sinon le contenu (icône 100px +
        // texte) peut dépasser de sa moitié de ligne et chevaucher `conditions` à côté.
        width: 110,
        // backgroundColor: withOpacity(app_colors.red.main, 0.2),

        icon: {
          width: 100,
          height: 100,
        },

        description: {
          color: app_colors.white,
          fontSize: 14,
          fontFamily: "DMMonoRegular",
          textAlign: "center" as const,
        }
      },

      conditions: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "flex-end" as const,
        gap: 5,
        // flex:1 : prend tout ce qu'il reste après la largeur fixe de iconContainer.
        flex: 1,
        // backgroundColor: withOpacity(app_colors.white, 0.2),

        main: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 5,

          text: {
            color: app_colors.yellow.main,
            fontSize: 35,
            fontFamily: "ZTNatureBold",
          },
        },

        row: {
          display: "flex" as const,
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          gap: 10,
        },

        item: {
          // Largeur fixe plutôt que flex:1 (qui étirait chaque item sur la moitié de la ligne,
          // écartant les deux icônes aux extrémités) : avec une largeur fixe, les deux items se
          // regroupent — leurs icônes se rejoignent au centre (voir `reverse` plus bas), et comme
          // `conditions` a alignItems:"flex-end", l'ensemble se cale tout seul sur le bord droit.
          width: 90,
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "flex-start" as const,
          gap: 10,

          reverse: {
            flexDirection: "row-reverse" as const,
          },

          text: {
            color: app_colors.white,
            fontSize: 16,
            fontFamily: "DMMonoMedium",
          },

          icon: {
            display: "flex" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            backgroundColor: withOpacity(app_colors.white, 0.2),
            borderRadius: 100,
            width: 30,
            height: 30,
          }
        }
      }
    }
  }
}