import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const hourlyDetailsCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,
    gap: 12,
    display: "flex" as const,
    flexDirection: "column" as const,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,

      info: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 10,
      },

      icon: {
        width: 50,
        height: 50,
      },

      description: {
        color: app_colors.white,
        fontSize: 14,
        fontFamily: "DMMonoMedium",
        textTransform: "capitalize" as const,
      },

      temp: {
        color: app_colors.yellow.main,
        fontSize: 28,
        fontFamily: "ZTNatureBold",
      },

      // Texte du score, au centre du rappel circulaire dans le coin haut droit de la carte.
      score: {
        fontSize: 16,
        fontFamily: "ZTNatureBold",
      },
    },

    sectionTitle: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: "ZTNatureBold",
      textTransform: "uppercase" as const,
      marginBottom: 10,
    },

    noData: {
      color: withOpacity(app_colors.white, 0.6),
      fontSize: 13,
      fontFamily: "DMMonoRegular",
    },

    // Grille 2 colonnes des données détaillées — même logique visuelle que les pastilles d'icône de
    // WeatherSummary (cercle translucide blanc), pour rester cohérent avec la carte résumé juste
    // au-dessus sur le même écran.
    grid: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 12,

      item: {
        flexBasis: "45%" as const,
        flexGrow: 1,
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,

        icon: {
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: withOpacity(app_colors.white, 0.2),
          display: "flex" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },

        label: {
          color: withOpacity(app_colors.white, 0.6),
          fontSize: 11,
          fontFamily: "DMMonoRegular",
        },

        value: {
          color: app_colors.white,
          fontSize: 15,
          fontFamily: "DMMonoMedium",
        },
      },
    },
  },
};
