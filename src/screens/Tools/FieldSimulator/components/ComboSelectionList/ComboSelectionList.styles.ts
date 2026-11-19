import { app_colors, radius, typography } from "../../../../../helpers/variables";

export const comboSelectionListStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  // Titre en forme de séparateur ("AVEC QUEL SETUP ?" barré de chaque côté par un trait), comme sur
  // la maquette — pas de composant partagé pour ce motif précis ailleurs dans l'app.
  titleRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    line: {
      flex: 1,
      height: 1,
      backgroundColor: app_colors.accent.light,
    },

    text: {
      ...typography.dmMono.semiBold.pillButton,
      fontSize: 11,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },
  },

  rowValue: {
    fontFamily: "ZTNatureBold",
    fontSize: 16,
    color: app_colors.primary.main,
  },

  addButton: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: app_colors.accent.main,
    borderStyle: "dashed" as const,
    borderRadius: radius.heroCard,

    text: {
      ...typography.dmMono.semiBold.pillButton,
      fontSize: 13,
      color: app_colors.accent.main,
    },
  },
};
