import { app_colors, radius, withOpacity } from "../../../../../helpers/variables";

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

      formRow: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

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
          gap: 5,

          gradeButton: {
            borderRadius: radius.heroCard,
          }
        }
      }
    }
  }
}