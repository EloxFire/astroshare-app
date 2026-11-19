import { app_colors, radius, typography } from "../../../../../helpers/variables";

// Même esprit que SunImageryCard (image principale + rangée de vignettes), mais des vignettes
// carrées (cartes du monde, pas des disques) et sans les contrôles lecture/plein écran — les
// images d'aurores sont statiques, pas d'animation fournie par l'API.
export const auroraForecastCardStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    // Bloc "chez vous" : remplace l'ancien badge d'en-tête (peu lisible) par un aperçu détaillé de
    // la probabilité locale, juste au-dessus de l'image sélectionnée. Couleurs (bg/fg) appliquées
    // dynamiquement selon le niveau — voir AuroraForecastCard (même logique que auroraFavorable
    // dans MagneticFieldCard).
    localForecast: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: radius.mediumCard,

      info: {
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 4,

        header: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 6,
        },

        title: {
          ...typography.dmMono.regular.rowMeta,
          fontSize: 11,
          textTransform: "uppercase" as const,
        },

        label: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
        },
      },

      value: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "baseline" as const,
        gap: 3,

        main: {
          fontFamily: "ZTNatureBold",
          fontSize: 28,
        },
        unit: {
          fontFamily: "ZTNatureBold",
          fontSize: 14,
        },
      },
    },

    image: {
      width: "100%" as const,
      resizeMode: "cover" as const,
      borderRadius: radius.mediumCard,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      aspectRatio: 1,
    },

    caption: {
      ...typography.dmMono.regular.rowMeta,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },

    imagesRow: {
      content: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 10,
        paddingHorizontal: 2,
        paddingVertical: 2,
      },

      item: {
        display: "flex" as const,
        alignItems: "center" as const,
        gap: 4,
        width: 90,

        thumbnail: {
          width: 90,
          resizeMode: "cover" as const,
          borderRadius: radius.badge32,
          borderWidth: 1.5,
          borderColor: app_colors.accent.light,
          borderStyle: "dashed" as const,
          aspectRatio: 1,
        },

        thumbnailActive: {
          borderColor: app_colors.accent.main,
          borderStyle: "solid" as const,
        },

        label: {
          ...typography.dmMono.regular.rowMeta,
          fontSize: 10,
          color: app_colors.primary.medium,
          textAlign: "center" as const,
        },
      },
    },
  },
};
