import { app_colors, radius, spacing, withOpacity } from "../../../../helpers/variables";

export const checklistDetailsScreenStyles = {
  // Fusion ScreenHeader + bloc attenant (même fond, arrondi seulement en bas) : voir le même
  // principe documenté pour SatelliteDetailsScreen (docs/agents-reference.md §4, ScreenHeader).
  // ScreenHeader n'y reçoit pas de `title` : le vrai titre est affiché ici, en grand, à côté de la
  // jauge — comme sur la maquette, qui ne montre pas de titre répété dans la barre du dessus.
  heroHeader: {
    backgroundColor: app_colors.primary.main,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 18,
    borderBottomLeftRadius: radius.heroCard,
    borderBottomRightRadius: radius.heroCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,

    topRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: 10,
      marginTop: 10,
    },

    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: radius.badge38,
      backgroundColor: app_colors.red.main,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    progressRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 14,

      ringValue: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.white,
      },

      // Badge a alignSelf: "flex-start" en dur dans ses propres styles, qui écrase l'alignItems du
      // parent (même piège que dans SolarWindCard/KpCard côté Météo spatiale) : contourné en
      // l'enveloppant dans une View étirée sur toute la hauteur de la rangée plutôt que de laisser
      // le badge remonter en haut, désaligné de la jauge.
      badgeWrapper: {
        alignSelf: "stretch" as const,
        justifyContent: "center" as const,
      },
    },
  },

  description: {
    fontFamily: "DMMonoRegular",
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: app_colors.primary.medium,
  },

  addItemRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    addButton: {
      width: 44,
      height: 44,
      borderRadius: radius.badge44,
      backgroundColor: app_colors.accent.main,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      disabled: {
        opacity: 0.4,
      },
    },
  },

  emptySection: {
    fontFamily: "DMMonoRegular",
    fontSize: 12,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 10,
  },
};
