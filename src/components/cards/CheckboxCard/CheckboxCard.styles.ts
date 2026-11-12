import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";

export const checkboxCardStyles = {
  // Carte blanche bordée (defaultCard) en ligne : case à cocher à gauche, titre et sous-titre à droite.
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 14,
    gap: 14,
    // Bordure de 2 dans les deux états (seule sa couleur change) : passer de 1 à 2 en cochant
    // décalerait tout le contenu d'un pixel.
    borderWidth: 2,

    checked: {
      backgroundColor: app_colors.accent.light,
      borderColor: app_colors.accent.main,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },
  },
};
