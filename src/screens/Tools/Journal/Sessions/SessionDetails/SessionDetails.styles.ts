import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";

// Texte d'une liste vide, commun à toutes les sections de la fiche.
const emptyText = {
  fontFamily: "DMMonoRegular",
  fontSize: 12,
  color: app_colors.primary.medium,
  textAlign: "center" as const,
};

export const sessionDetailsStyles = {
  // Résumé en tête de fiche : la carte de session (date, lieu, horaires, notes), puis les compteurs
  // d'objets. Groupés dans une même colonne pour garder un écart serré entre les deux, plus petit
  // que celui qui sépare les sections (gap de globalStyles.content).
  summary: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    // Trois compteurs carrés, même habillage que ceux de l'écran Journal (objets observés) : le
    // premier en carte sombre à valeur jaune, le dernier sur fond jaune clair.
    stats: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,

      highlightCard: {
        backgroundColor: app_colors.primary.main,
      },

      highlightTitle: {
        color: app_colors.grey,
      },

      highlightValue: {
        fontSize: 30,
        color: app_colors.yellow.main,
      },

      lightCard: {
        backgroundColor: app_colors.yellow.light,
      },

      value: {
        fontSize: 30,
      },
    },
  },

  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    list: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
    },

    // Coquille carte-liste identique à celle du formulaire d'ajout : les lignes (ObjectCardLite)
    // gèrent elles-mêmes leur séparateur (prop withBorder).
    objectsList: {
      ...globalStyles.defaultCard,
    },

    noItems: {
      ...globalStyles.defaultCard,

      text: emptyText,
    },
  },

  notesCard: {
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
  },

  actions: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 10,

    deleteWarning: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },
}
