import { app_colors, typography } from "../../../../../helpers/variables";

export const solarWindCardStyles = {
  titleRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },

  badgeWrapper: {
    alignSelf: "stretch" as const,
    justifyContent: "center" as const,
  },

  relativeWrapper: {
    position: "relative" as const,
  },

  container: {
    marginTop: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,

    valueRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,

      value: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 5,
        alignItems: "baseline" as const,

        main: {
          fontFamily: "ZTNatureBold",
          fontSize: 30,
          color: app_colors.primary.main,
        },
        unit: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.primary.medium,
        },
      },
    },

    // Échelle à 4 paliers discrets (Lent/Modéré/Rapide/Très rapide) — contrairement au Bz (valeur
    // continue), le vent solaire n'est classé que par catégorie côté API (`level`), donc un
    // positionnement précis du marqueur dans son palier n'est pas possible : il est centré sur le
    // palier actif, comme un simple repère "vous êtes ici" plutôt qu'une position exacte.
    scale: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 8,

      track: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 3,

        segment: {
          flex: 1,
          height: 10,
          borderRadius: 5,
          backgroundColor: app_colors.accent.light,

          active: {
            backgroundColor: app_colors.yellow.main,
          },
        },
      },

      marker: {
        position: "absolute" as const,
        top: -2,
        bottom: -2,
        width: 3,
        marginLeft: -1.5,
        borderRadius: 1.5,
        backgroundColor: app_colors.primary.main,
      },

      labels: {
        display: "flex" as const,
        flexDirection: "row" as const,

        label: {
          flex: 1,
          textAlign: "center" as const,
          color: app_colors.primary.medium,
          fontSize: 12,
        },
      },
    },

    divider: {
      height: 1,
      backgroundColor: app_colors.primary.medium,
    },

    details: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      column: {
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 4,

        label: {
          color: app_colors.primary.medium,
          fontSize: 12,
        },
        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.primary.main,
        },
      },
    },

    description: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 12,
      lineHeight: 12 * 1.4,
      color: app_colors.primary.medium,
    },
  },
};
