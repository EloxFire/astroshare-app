import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing, withOpacity } from "../../../../../../helpers/variables";

export const addSetupStyles = {
  heroCard: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 16,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 4,

    label: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as const,
        color: app_colors.ambre.main,
      },

      required: {
        color: app_colors.red.main,
      },
    },

    // Fond translucide + bordure : sans ça, un TextInput posé à même la carte sombre ne se
    // distingue pas d'un simple texte (surtout une fois rempli) — rien n'indique qu'on peut
    // taper dedans. Même principe que les champs sur fond sombre déjà utilisés ailleurs (ex:
    // AddSession.styles.ts), ici en version "carte héro" : translucide blanc sur primary.main.
    nameField: {
      backgroundColor: withOpacity(app_colors.white, 0.12),
      borderWidth: 1,
      borderColor: withOpacity(app_colors.white, 0.2),
      borderRadius: radius.searchField,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginTop: 4,

      error: {
        borderColor: app_colors.red.main,
      },
    },

    nameError: {
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      color: app_colors.red.main,
      marginTop: 4,
    },

    nameInput: {
      fontFamily: "ZTNatureBold",
      fontSize: 22,
      color: app_colors.white,
      padding: 0,
    },

    descriptionField: {
      backgroundColor: withOpacity(app_colors.white, 0.12),
      borderWidth: 1,
      borderColor: withOpacity(app_colors.white, 0.2),
      borderRadius: radius.searchField,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginTop: 8,
    },

    descriptionInput: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: withOpacity(app_colors.white, 0.85),
      padding: 0,
    },

    pieceCount: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      gap: 6,
      marginTop: 10,

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 28,
        lineHeight: 28,
        color: app_colors.ambre.main,
      },

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: withOpacity(app_colors.white, 0.7),
        marginBottom: 3,
      },
    },
  },

  compositionSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  categoryCard: {
    ...globalStyles.defaultCard,
    flexDirection: "column" as const,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },

      badge: {
        fontFamily: "DMMonoRegular",
        fontSize: 10,
        color: app_colors.primary.medium,
      },
    },

    chipsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,
    },

    chip: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,
      backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      borderRadius: radius.pill,
      paddingVertical: spacing.chip.vertical,
      paddingHorizontal: spacing.chip.horizontal + 4,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: app_colors.primary.main,
      },

      active: {
        backgroundColor: app_colors.primary.main,
        borderColor: app_colors.primary.main,

        text: {
          color: app_colors.white,
        },
      },
    },

    // Pas de précédent "ajout inline" dans un chip row existant ailleurs dans l'app : contour
    // pointillé (plutôt que la pilule pleine accent.main déjà utilisée pour les CTA "vide" pleine
    // largeur, trop lourde ici) pour rester visuellement au niveau des chips qui l'entourent.
    emptyStateButton: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,
      borderWidth: 1,
      borderColor: app_colors.accent.main,
      borderStyle: "dashed" as const,
      borderRadius: radius.pill,
      paddingVertical: spacing.chip.vertical,
      paddingHorizontal: spacing.chip.horizontal + 4,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: app_colors.accent.main,
      },
    },
  },

  actions: {
    marginTop: 10,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    saveButton: {
      ...globalStyles.button,
    },

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
  },
}
