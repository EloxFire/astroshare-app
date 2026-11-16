import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const launchWindowChartStyles = {
  card: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    padding: 14,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      alignItems: "center" as const,
      gap: 6,

      badge: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 4,
        backgroundColor: app_colors.primary.main,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.pill,

        text: {
          fontSize: 11,
          fontFamily: "DMMonoMedium" as const,
          color: app_colors.white,
        },

        // Distingue la fermeture du T-0 sans un deuxième violet identique.
        close: {
          backgroundColor: app_colors.primary.medium,
        },
      },
    },

    // Zone de tracé : l'axe est centré verticalement, la fenêtre (si présente) et les repères de
    // décollage/fermeture se positionnent en `left` (%) par-dessus.
    track: {
      height: 46,
      position: "relative" as const,
      marginTop: 4,

      axis: {
        position: "absolute" as const,
        top: 22,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: app_colors.accent.light,
      },

      band: {
        position: "absolute" as const,
        top: 6,
        bottom: 6,
        borderRadius: radius.searchField,
        borderWidth: 1,
        borderColor: app_colors.accent.main,
        borderStyle: "dashed" as const,
        backgroundColor: withOpacity(app_colors.accent.main, 0.12),
        alignItems: "center" as const,
        justifyContent: "center" as const,

        text: {
          fontSize: 10,
          fontFamily: "DMMonoMedium" as const,
          color: app_colors.primary.main,
        },
      },

      // width:0 + borderLeft plutôt qu'une largeur pleine : seul moyen simple d'avoir un trait
      // vertical en pointillés sous React Native (pas de borderStyle sur un View plein).
      marker: {
        position: "absolute" as const,
        top: 2,
        bottom: 2,
        width: 2,
        marginLeft: -1,
        backgroundColor: app_colors.primary.main,
        borderRadius: 1,

        dashed: {
          width: 0,
          backgroundColor: "transparent",
          borderLeftWidth: 2,
          borderStyle: "dashed" as const,
          borderLeftColor: app_colors.primary.medium,
        },
      },
    },

    ticks: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      text: {
        fontSize: 9,
        fontFamily: "DMMonoRegular" as const,
        color: app_colors.primary.medium,
      },
    },

    note: {
      fontSize: 12,
      fontFamily: "ZTNatureRegular" as const,
      color: app_colors.primary.medium,
      lineHeight: 17,
    },
  },
};
