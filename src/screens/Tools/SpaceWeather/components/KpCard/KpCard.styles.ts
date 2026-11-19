import { app_colors, typography } from "../../../../../helpers/variables";

export const kpCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderColor: app_colors.primary.main,
  },

  valueRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.grey,
    paddingBottom: 4,

    value: {
      fontFamily: "ZTNatureBold",
      fontSize: 30,
      color: app_colors.yellow.main,
    },

    unit: {
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      color: app_colors.grey,
    },

    // alignSelf: "center" plutôt que de compter sur le alignItems:"baseline" du parent : ce
    // dernier n'a de sens que pour du texte, pas pour cette View (icône + texte) — même leçon que
    // pour Badge plus haut dans la session.
    trend: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 4,
      marginLeft: "auto" as const,
      alignSelf: "center" as const,

      label: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.yellow.main,
        fontSize: 12,
      },
    },
  },
};
