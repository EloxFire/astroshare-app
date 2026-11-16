import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const launchCardStyles = {
  // Pas de ...globalStyles.defaultCard ici : son padding empêcherait l'image de toucher les bords
  // de la carte. overflow:"hidden" cadre l'image dans les coins arrondis à sa place.
  card: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    overflow: "hidden" as const,
    display: "flex" as const,
    flexDirection: "column" as const,

    imageContainer: {
      width: "100%" as const,
      aspectRatio: 16 / 9,
      position: "relative" as const,

      image: {
        width: "100%" as const,
        height: "100%" as const,
        backgroundColor: app_colors.primary.main,
      },

      overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "flex-start" as const,
        padding: 8,

        date: {
          backgroundColor: withOpacity(app_colors.black, 0.55),
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: radius.pill,

          text: {
            fontSize: 11,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.white,
            textTransform: "uppercase" as const,
          },
        },
      },
    },

    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
      padding: 12,

      // Logo de l'agence (repli : initiales) — même principe que NextLaunchCard.
      avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: app_colors.accent.light,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        overflow: "hidden" as const,
        borderWidth: 1,
        borderColor: app_colors.accent.light,

        // Plein cadre (pas de marge interne) : en resizeMode="cover", le logo remplit toute la
        // pastille quitte à mordre un peu ses bords, plutôt que de flotter en petit au centre.
        logo: {
          width: "100%" as const,
          height: "100%" as const,
        },

        text: {
          fontSize: 11,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.primary.main,
        },
      },

      texts: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 2,

        title: {
          fontSize: 16,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.primary.main,
        },

        subtitle: {
          fontSize: 12,
          fontFamily: "ZTNatureRegular" as const,
          color: app_colors.primary.medium,
        },
      },
    },
  },
};
