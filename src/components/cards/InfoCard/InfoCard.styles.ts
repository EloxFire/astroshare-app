import { app_colors, radius } from "../../../helpers/variables";

export const infoCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,

    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,

    infos: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      gap: 5,

      title: {
        color: app_colors.white,
        fontFamily: "ZTNatureBold",
        fontSize: 14,

        // Style simple pour mettre en valeur un segment du titre via <Trans> (ex: la valeur
        // SQM dans addObservatory.lightPollution.title) — mêmes police/taille que le titre,
        // seule la couleur change.
        highlight: {
          // color: app_colors.yellow.main,
          fontSize: 10,
        },

        bortle: {
          color: app_colors.yellow.main,
        }
      },

      description: {
        color: app_colors.white,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,

        // Même principe que title.highlight : met en valeur un segment via <Trans> (ex:
        // l'indicateur de pollution lumineuse dans addObservatory.lightPollution.description).
        highlight: {
          color: app_colors.yellow.main,
          fontFamily: "ZTNatureBold",
        },
      }
    }
  }
}