import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const nextLaunchCardStyles = {
  container: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 16,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    // overflow:"hidden" pour que l'image de fond (position:"absolute", voir backgroundImage)
    // reste bien cadrée dans les coins arrondis de la carte.
    position: "relative" as const,
    overflow: "hidden" as const,

    backgroundImage: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    // Entre l'image et le texte : sans lui, le blanc/jaune du texte devient illisible selon la
    // photo (fond clair, zones très contrastées...).
    scrim: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: withOpacity(app_colors.primary.main, 0.78),
    },

    headerRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,

      heading: {
        color: withOpacity(app_colors.white, 0.6),
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      },
    },

    divider: {
      height: 1,
      backgroundColor: withOpacity(app_colors.white, 0.15),
    },

    footerRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: withOpacity(app_colors.white, 0.15),
        alignItems: "center" as const,
        justifyContent: "center" as const,
        overflow: "hidden" as const,

        // Plein cadre (pas de marge interne) : en resizeMode="cover", le logo remplit toute la
        // pastille quitte à mordre un peu ses bords, plutôt que de flotter en petit au centre.
        logo: {
          width: "100%" as const,
          height: "100%" as const,
        },

        text: {
          color: app_colors.white,
          fontFamily: "ZTNatureBold",
          fontSize: 13,
        },
      },

      texts: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "column" as const,

        name: {
          color: app_colors.white,
          fontFamily: "ZTNatureBold",
          fontSize: 15,
        },

        subtitle: {
          color: withOpacity(app_colors.white, 0.6),
          fontFamily: "ZTNatureRegular",
          fontSize: 12,
        },
      },
    },
  },
};
