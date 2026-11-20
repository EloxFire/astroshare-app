import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const checklistsScreenStyles = {
  // Carte de vue d'ensemble en haut de la grille : même langage visuel que le héros de
  // ChecklistDetailsScreen (fond primary.main, jauge jaune), pour que l'écran principal ne se
  // limite pas à l'en-tête clair + une grille de petites cartes blanches, qui laissait un rendu un
  // peu vide une fois les cartes réduites (retour utilisateur).
  overview: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,

    ringValue: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.white,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.white,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: withOpacity(app_colors.white, 0.8),
      },
    },
  },
};
