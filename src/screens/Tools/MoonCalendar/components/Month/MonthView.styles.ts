import { app_colors, radius } from "../../../../../helpers/variables";

export const monthViewStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,

    arrow: {
      width: 32,
      height: 32,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    arrowLabel: {
      color: app_colors.primary.main,
      fontSize: 22,
      fontFamily: "ZTNatureBold",
    },

    arrowLabelDisabled: {
      color: app_colors.primary.light,
    },

    title: {
      color: app_colors.primary.main,
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      textTransform: "capitalize" as const,
    },
  },

  weekdaysRow: {
    display: "flex" as const,
    flexDirection: "row" as const,

    label: {
      flex: 1,
      textAlign: "center" as const,
      color: app_colors.primary.medium,
      fontFamily: "DMMonoMedium",
      fontSize: 11,
      textTransform: "uppercase" as const,
    },
  },

  grid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 4,
  },

  weekRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 4,
  },

  // aspectRatio (plutôt qu'une hauteur fixe) pour que la cellule reste correcte quelle que
  // soit la largeur d'écran, vu que la largeur dépend de `flex: 1` sur 7 colonnes.
  dayCell: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: radius.mediumCard,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 2,
    padding: 2,

    image: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },

    dayNumber: {
      color: app_colors.primary.main,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
    },

    badge: {
      color: app_colors.primary.medium,
      fontFamily: "DMMonoMedium",
      fontSize: 7.5,
      textTransform: "uppercase" as const,
    },
  },

  dayCellToday: {
    borderWidth: 2,
    borderColor: app_colors.accent.main,
  },

  dayCellOutside: {
    opacity: 0.3,
    borderColor: "transparent",
  },
};
