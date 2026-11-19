import { app_colors, radius, typography } from "../../../../../helpers/variables";

export const comboResultCardStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 10,
  },

  texts: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 2,

    label: {
      fontFamily: "ZTNatureBold",
      fontSize: 15,
      color: app_colors.primary.main,
      textAlign: "center" as const,
    },

    occupancy: {
      ...typography.dmMono.regular.rowMeta,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },

  // Grille "comparer" : cartes plus étroites, texte réduit — mêmes styles de base que `texts`,
  // juste une taille de police plus petite pour ne pas déborder à 2 par ligne.
  compact: {
    label: {
      fontSize: 13,
    },
    occupancy: {
      fontSize: 11,
    },
  },

  grid: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 16,
    justifyContent: "space-between" as const,

    item: {
      width: "47%" as const,
      backgroundColor: app_colors.white,
      borderRadius: radius.heroCard,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      padding: 10,
    },
  },
};
