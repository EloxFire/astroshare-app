import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const tonightPickCardStyles = {
  card: {
    flexBasis: "48%" as const,
    flexGrow: 1,
    borderRadius: radius.heroCard,
    padding: 12,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    minHeight: 110,

    // Alternance décorative (index pair/impair), pas une couleur qui prétend encoder une donnée
    // (contrairement à Bortle/NOAA ailleurs dans l'app) — juste un peu de rythme visuel sur une
    // grille de 2 à 4 cartes.
    dark: {
      backgroundColor: app_colors.primary.main,
    },
    amber: {
      backgroundColor: app_colors.yellow.light,
    },

    badge: {
      alignSelf: "flex-start" as const,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: radius.pill,
      backgroundColor: withOpacity(app_colors.white, 0.15),

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 9,
        textTransform: "uppercase" as const,
      },

      textDark: {
        color: app_colors.white,
      },

      textAmber: {
        color: app_colors.primary.main,
      },
    },

    name: {
      fontFamily: "ZTNatureBold",
      fontSize: 15,

      dark: {
        color: app_colors.white,
      },
      amber: {
        color: app_colors.primary.main,
      },
    },

    subtitle: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,

      dark: {
        color: withOpacity(app_colors.white, 0.65),
      },
      amber: {
        color: withOpacity(app_colors.primary.main, 0.65),
      },
    },
  },
};
