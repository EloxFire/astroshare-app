import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing, withOpacity } from "../../../helpers/variables";

export const issTransitsScreenStyles = {
  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,
  },

  locationSummary: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,

    text: {
      flex: 1,
      fontFamily: "ZTNatureBold",
      fontSize: 15,
      color: app_colors.primary.main,
    },
  },

  locationActions: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 16,

    link: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      color: app_colors.accent.main,
    },
  },

  // Même rayon/hauteur que la carte de StepOne (ajout d'observatoire) : cohérent avec l'autre
  // sélecteur de lieu sur carte déjà dans l'app.
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 180,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    },
  },

  dateRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    field: {
      flex: 1,
      backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      borderRadius: radius.mediumCard,
      padding: spacing.toolCard,

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 9.5,
        color: app_colors.primary.medium,
        textTransform: "uppercase" as const,
        marginBottom: 4,
      },

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },
    },
  },

  // Même structure que le panneau iOS de AddSession (date/heure de session) — ici date seule.
  pickerSheet: {
    backdrop: {
      flex: 1,
      justifyContent: "flex-end" as const,
      backgroundColor: withOpacity(app_colors.black, 0.4),
    },

    dismissArea: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    container: {
      backgroundColor: app_colors.white,
      borderTopLeftRadius: radius.modalSheetTop,
      borderTopRightRadius: radius.modalSheetTop,
      paddingTop: spacing.modalSheet.top,
      paddingHorizontal: spacing.modalSheet.horizontal,
      gap: 12,

      header: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: gaps.iconToText,

        title: {
          ...globalStyles.categoryTitle,
          flex: 1,
        },
      },

      doneButton: {
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.accent.main,
        paddingVertical: spacing.pillButtonPrimary.vertical,
        borderRadius: radius.badge32,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 14,
          color: app_colors.white,
        },
      },
    },
  },

  disclaimer: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    lineHeight: 10.5 * 1.4,
    color: app_colors.primary.medium,
  },

  explanationCard: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    item: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.primary.light,
        paddingBottom: 10,
      },

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.primary.main,
      },

      description: {
        fontFamily: "DMMonoRegular",
        fontSize: 11.5,
        lineHeight: 11.5 * 1.4,
        color: app_colors.primary.medium,
      },
    },
  },

  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  emptyState: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 20,
  },

  loader: {
    marginTop: 40,
  },
};
