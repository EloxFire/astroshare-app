import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, radius } from "../../../helpers/variables";

export const iconButtonCardStyles = {
  // Même carte blanche bordée que le reste de l'app (defaultCard), disposée en ligne : pastille à
  // gauche (icône ou date), titre et sous-titre à droite.
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 14,
    gap: 12,

    // Bordure gardée à 1 px (seule sa couleur change) : l'épaissir décalerait le contenu.
    selected: {
      backgroundColor: app_colors.accent.light,
      borderColor: app_colors.accent.main,
    },

    // Pastille carrée 44 px : radius.badge44 est le rayon prévu pour cette taille de pastille. Même
    // taille avec une icône ou une date, pour que des cartes côte à côte restent alignées.
    badge: {
      width: 44,
      height: 44,
      borderRadius: radius.badge44,
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      // Date : même présentation que le bloc date de la carte de session du Journal (jour en
      // ZTNatureBold, mois en DMMonoMedium majuscules), à l'échelle de la pastille de 44 px (le bloc
      // du Journal fait 60 px, avec un jour en 25 et un mois en 12).
      day: {
        fontFamily: "ZTNatureBold",
        fontSize: 18,
        lineHeight: 18,
        color: app_colors.primary.main,
      },

      month: {
        fontFamily: "DMMonoMedium",
        fontSize: 9,
        lineHeight: 10,
        textTransform: "uppercase" as const,
        color: app_colors.primary.main,
      },
    },

    // flex:1 + flexShrink : en demi-largeur, les textes trop longs sont coupés (numberOfLines) au
    // lieu de pousser la carte hors de sa colonne.
    texts: {
      flex: 1,
      flexShrink: 1,
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
