import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing } from "../../../../../../helpers/variables";

export const telescopeDetailsStyles = {
  topRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    marginBottom: 10,

    // Pas de prop dédiée sur ScreenHeader pour un bouton en haut à droite (le header commun n'est
    // pas à modifier pour cet écran) : ce bouton est donc posé juste au-dessus de la carte héro,
    // pas littéralement superposé au header comme sur la maquette.
    editButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.pill,
      paddingVertical: spacing.chip.vertical,
      paddingHorizontal: spacing.chip.horizontal + 4,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: app_colors.primary.main,
      },
    },
  },

  heroCard: {
    padding: 16,
    borderRadius: radius.heroCard,
    backgroundColor: app_colors.accent.light,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,

    topRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      gap: 10,

      iconBadge: {
        backgroundColor: app_colors.white,
        borderRadius: radius.badge44,
        padding: 10,
      },

      // flex:1 : sans ça, cette colonne se dimensionne sur son contenu (le texte) plutôt que sur
      // l'espace restant après le badge icône, et un nom long déborde de la carte au lieu de
      // passer à la ligne.
      textBlock: {
        display: "flex" as const,
        flexDirection: "column" as const,
        flex: 1,
        gap: 2,

        kindLabel: {
          fontFamily: "DMMonoMedium",
          fontSize: 10,
          textTransform: "uppercase" as const,
          color: app_colors.primary.main,
        },

        title: {
          fontFamily: "ZTNatureBold",
          fontSize: 25,
          color: app_colors.primary.main,
        },
      },
    },

    chipsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 7,

      chip: {
        backgroundColor: app_colors.white,
        borderRadius: radius.pill,
        paddingVertical: spacing.chip.vertical,
        paddingHorizontal: spacing.chip.horizontal + 4,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.main,
        },
      },
    },
  },

  characteristicsGrid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },
  },

  usedInSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    noItems: {
      ...globalStyles.defaultCard,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
        textAlign: "center" as const,
      },
    },

    row: {
      ...globalStyles.defaultCard,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      iconBadge: {
        backgroundColor: app_colors.yellow.light,
        borderRadius: radius.badge32,
        padding: 10,
      },

      textBlock: {
        display: "flex" as const,
        flexDirection: "column" as const,
        flex: 1,
        gap: 2,

        title: {
          fontFamily: "ZTNatureBold",
          fontSize: 14,
          color: app_colors.primary.main,
        },

        subtitle: {
          fontFamily: "DMMonoRegular",
          fontSize: 10,
          color: app_colors.primary.medium,
        },
      },
    },
  },

  notesCard: {
    ...globalStyles.defaultCard,

    title: {
      ...globalStyles.categoryTitle,
      fontSize: 12,
    },

    text: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    },
  },

  actions: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 10,

    deleteButton: {
      backgroundColor: app_colors.red.light,
      padding: 10,
      borderRadius: radius.badge32,
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 14,
        lineHeight: 16,
        color: app_colors.red.main,
      },
    },

    deleteWarning: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },
}
