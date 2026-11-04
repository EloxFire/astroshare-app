import { app_colors, radius, withOpacity } from "../../../../../../helpers/variables";

export const viewerSectionStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    // Coupe la scène 3D (plein cadre, voir `scene`) aux coins arrondis de la carte, sans avoir à
    // dupliquer ce rayon sur la scène elle-même.
    overflow: "hidden" as const,
    alignItems: "center" as const,
  },

  // Occupe toute la largeur de la carte, hauteur dérivée par aspectRatio plutôt que fixe : s'adapte
  // à n'importe quelle largeur d'écran au lieu d'un visualiseur de taille figée au milieu de la carte.
  scene: {
    width: "100%" as const,
    aspectRatio: 1,
    position: "relative" as const,

    // Badge "3D" + bouton de partage flottent par-dessus la scène au lieu d'occuper une rangée à
    // part — la scène peut ainsi remplir tout le cadre sans être poussée vers le bas.
    overlay: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      padding: 16,
    },

    image: {
      width: "100%" as const,
      height: "100%" as const,
    },
  },

  bottomContent: {
    alignSelf: "stretch" as const,
    alignItems: "center" as const,
    padding: 16,
  },

  caption: {
    fontFamily: "DMMonoRegular",
    fontSize: 11,
    color: withOpacity(app_colors.white, 0.6),
    textAlign: "center" as const,
  },
};
