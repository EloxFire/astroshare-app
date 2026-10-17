import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, radius, withOpacity } from "../../../helpers/variables";

// Layout partagé par les 3 variantes — seules les couleurs changent d'une variante à l'autre.
const infosLayout = {
  display: "flex" as const,
  flexDirection: "column" as const,
  flex: 1,
};

export const infoCardStyles = {
  // Fond blanc (defaultCard, voir globalStyles) — pour poser la carte sur un fond déjà coloré/sombre.
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,

    infos: {
      ...infosLayout,

      title: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 14,

        // Style simple pour mettre en valeur un segment du titre via <Trans> (ex: la valeur
        // SQM dans settings/addObservatory:stepOne.lightPollution.title) — mêmes police/taille
        // que le titre, seule la couleur change.
        highlight: {
          fontSize: 10,
        },

        bortle: {
          color: app_colors.yellow.main,
        }
      },

      description: {
        color: app_colors.primary.medium,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,

        // Même principe que title.highlight : met en valeur un segment via <Trans> (ex: l'indicateur
        // de pollution lumineuse dans settings/addObservatory:stepOne.lightPollution.description).
        highlight: {
          color: app_colors.accent.main,
          fontFamily: "ZTNatureBold",
        },
      }
    }
  },

  // Fond primary.main — pour poser la carte sur un fond déjà clair.
  cardDark: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: app_colors.primary.main,
    borderColor: withOpacity(app_colors.accent.main, 0.5),
    borderWidth: 1,

    infos: {
      ...infosLayout,

      title: {
        color: app_colors.yellow.main,
        fontFamily: "ZTNatureBold",
        fontSize: 14,

        highlight: {
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

        highlight: {
          color: app_colors.yellow.main,
          fontFamily: "ZTNatureBold",
        },
      }
    }
  },

  // Fond accent.light — variante teintée, intermédiaire entre card et cardDark.
  cardDarkLight: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: app_colors.accent.light,
    borderColor: withOpacity(app_colors.primary.main, 0.15),
    borderWidth: 1,

    infos: {
      ...infosLayout,

      title: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 14,

        highlight: {
          fontSize: 10,
        },

        bortle: {
          color: app_colors.yellow.main,
        }
      },

      description: {
        color: app_colors.primary.medium,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,

        highlight: {
          color: app_colors.accent.main,
          fontFamily: "ZTNatureBold",
        },
      }
    }
  }
}
