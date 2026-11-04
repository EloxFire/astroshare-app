export const statsSectionStyles = {
  grid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  },

  // Override de largeur pour poser ValueCard (flex:1 par défaut, pensé pour une rangée) dans une
  // grille à 2 colonnes qui wrap — le flexGrow:1 d'origine reste, seule la base de départ change.
  tileSize: {
    flexBasis: "47%" as const,
  },
};
