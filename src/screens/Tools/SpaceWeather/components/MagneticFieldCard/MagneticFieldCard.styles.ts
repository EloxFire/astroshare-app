import { app_colors, typography } from "../../../../../helpers/variables";

export const magneticFieldCardStyles = {
  titleRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },

  valueGroup: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 5,
    alignItems: "baseline" as const,
  },

  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 20,

    values: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,
      gap: 20,

      text: {
        fontFamily: "ZTNatureRegular",
        fontSize: 16,
        color: app_colors.primary.main,
      },
      main: {
        fontFamily: "ZTNatureBold",
        fontSize: 30,
        color: app_colors.primary.main,
      },
      secondary: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },
      unit: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.medium,
      },
    },
  },

  // Jauge divergente centrée sur 0 (-30 à +30) : même esprit structurel que bortleScale dans
  // ObservatoryDetails.styles.ts (piste + libellés d'extrêmes en dessous), mais une barre continue
  // plutôt que des segments discrets — le Bz est une valeur continue, pas un palier.
  bzScale: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,

    track: {
      height: 10,
      borderRadius: 5,
      backgroundColor: app_colors.accent.light,
      overflow: "hidden" as const,

      fill: {
        position: "absolute" as const,
        top: 0,
        bottom: 0,
        backgroundColor: app_colors.yellow.main,
      },

      marker: {
        position: "absolute" as const,
        top: -2,
        bottom: -2,
        width: 3,
        marginLeft: -1.5, // centre la barre sur sa position plutôt que de l'ancrer par son bord gauche
        borderRadius: 1.5,
        backgroundColor: app_colors.primary.main,
      },
    },

    extremes: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      text: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },
  },
};
