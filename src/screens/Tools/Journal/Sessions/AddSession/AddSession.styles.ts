import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing, withOpacity } from "../../../../../helpers/variables";

export const addSessionStyles = {
  dateSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    datePickerCard: {
      backgroundColor: app_colors.primary.main,
      padding: 10,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,


      datePickerContainer: {
        display: "flex" as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 20,

        picker: {
          display: "flex" as const,
          flexDirection: 'column' as const,
          flex: 1,
          backgroundColor: withOpacity(app_colors.white, 0.2),
          borderRadius: radius.heroCard,
          padding: 10,
          
          text: {
            fontFamily: "DMMonoRegular",
            fontSize: 12,
            color: app_colors.grey,
            textTransform: "uppercase" as const,
            marginBottom: 10,
          },

          time: {
            fontFamily: "ZTNatureBold",
            fontSize: 25,
            lineHeight: 25,
            color: app_colors.white,
          },

          date: {
            fontFamily: "DMMonoRegular",
            fontSize: 12,
            color: app_colors.grey,
          }
        },
      },

      timespanContainer: {
        display: "flex" as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 10,
      }
    },

    // iOS uniquement : Android affiche directement ses boîtes de dialogue natives (date puis
    // heure), déjà modales par nature — seul iOS a besoin de ce panneau pour héberger son picker,
    // qui s'affiche sinon en ligne dans la page (voir AddSession.tsx).
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
          }
        }
      }
    }
  },

  venueSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    noObservatories: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
        marginTop: 10,
      },

      button: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.accent.main,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: radius.badge32,
        marginTop: 10,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.white,
          marginLeft: 5,
        }
      }
    },
    observatoryList: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
      marginTop: 10,
    }
  },

  skyQualitySection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    form: {
      backgroundColor: app_colors.yellow.light,
      padding: 20,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,

      formRow: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        withBorder: {
          borderBottomWidth: 1,
          borderBottomColor: app_colors.primary.light,
          paddingBottom: 10,
        },

        leftColumn: {
          display: "flex" as const,
          flexDirection: "column" as const,
          gap: 5,

          label: {
            fontFamily: "ZTNatureBold",
            fontSize: 16,
            color: app_colors.primary.main,
          },

          description: {
            fontFamily: "DMMonoRegular",
            fontSize: 10,
            color: app_colors.primary.main,
          }
        },

        grade: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 10,

          gradeButton: {
            borderRadius: radius.heroCard,
          }
        }
      }
    }
  },

  observationLogSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,
    // Le panneau de suggestions de InputWithIcon flotte en position absolute par-dessus la suite
    // de l'écran (voir InputWithIcon.styles.ts) : zIndex ne s'applique qu'entre enfants d'un même
    // parent, donc il faut aussi élever cette section au-dessus de celles qui la suivent (sinon
    // leur contenu continue de s'afficher par-dessus le panneau, dans l'ordre normal du flux).
    zIndex: 10,

    // Coquille carte-liste identique à globalStyles.defaultCard (bordée, blanche, coins arrondis) :
    // les lignes (ObjectCardLite) gèrent elles-mêmes leur séparateur interne (prop withBorder).
    objectsList: {
      ...globalStyles.defaultCard,
      marginTop: 10,
    },

    noItems: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: 10,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      }
    },
  },

  usedGearSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    noSetups: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: 10,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      },

      button: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.accent.main,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: radius.badge32,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.white,
          marginLeft: 5,
        }
      }
    }
  },

  notesSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,
  }
}