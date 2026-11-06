import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const journalScreenStyles = {
  sessionsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    
    sessionCard: {
      padding: 10,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      flexDirection: "column" as const,
      backgroundColor: app_colors.primary.main,

      header: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "flex-start" as const,
        alignItems: "center" as const,

        date: {
          backgroundColor: app_colors.yellow.main,
          borderRadius: radius.badge44,
          padding: 10,
          width: 60,
          height: 60,
          display: "flex" as const,
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,

          number: {
            fontSize: 25,
            lineHeight: 25,
            fontFamily: "ZTNatureBold" as const,
            color: app_colors.primary.main,
          },

          month: {
            fontSize: 12,
            lineHeight: 12,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.primary.main,
          }
        },

        content: {
          display: "flex" as const,
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "flex-start" as const,
          marginLeft: 10,

          subtitle: {
            fontSize: 12,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.accent.light,
            textTransform: "uppercase" as const,
          },

          title: {
            fontSize: 18,
            fontFamily: "ZTNatureBold" as const,
            color: app_colors.white,
          },

          text: {
            fontSize: 12,
            fontFamily: "DMMonoMedium" as const,
            color: withOpacity(app_colors.white, 0.5),
          }
        }
      },

      content: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        gap: 10,
        marginTop: 10,

        gradeCard: {
          backgroundColor: withOpacity(app_colors.white, 0.1),
          borderRadius: radius.badge32,
          flex: 1,
          padding: 10,

          title: {
            fontSize: 12,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.grey,
          },

          grades: {
            display: "flex" as const,
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 3,

            grade: {
              flex: 1,
              height: 5,
              backgroundColor: withOpacity(app_colors.white, 0.2),
              borderRadius: radius.heroCard,
              marginTop: 5,

              active: {
                backgroundColor: app_colors.yellow.main,
              }
            }
          }
        }
      },
    },

    stats: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
      marginTop: 10,
    },

    addSessionButton: {
      backgroundColor: app_colors.accent.main,
      borderRadius: radius.badge44,
      padding: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 10,

      text: {
        fontSize: 16,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.white,
        marginLeft: 5,
      }
    },

    seeAll: {
      backgroundColor: app_colors.white,
      borderRadius: radius.badge44,
      padding: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 10,
      borderWidth: 1,
      borderColor: app_colors.accent.main,

      text: {
        fontSize: 16,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.accent.main,
        marginLeft: 5,
      }
    }
  },

  observationsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginTop: 20,

    lastObservationCard: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      illustration: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: app_colors.primary.main,
      },

      content: {
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "flex-start" as const,
        marginLeft: 10,
        gap: 5,

        subtitle: {
          fontSize: 10,
          fontFamily: "DMMonoMedium" as const,
          color: app_colors.accent.main,
          textTransform: "uppercase" as const,
        },

        title: {
          fontSize: 25,
          lineHeight: 25,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.primary.main,
        },

        name: {
          fontSize: 14,
          lineHeight: 14,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.primary.main,
        },

        text: {
          fontSize: 10,
          fontFamily: "DMMonoRegular" as const,
          color: app_colors.primary.main,
          marginTop: 5,
        }
      },

      iconContainer: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "flex-end" as const,
        alignItems: "center" as const,
        flex: 1,
      }
    },

    stats: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
      marginTop: 10,
    },
  },

  achievementsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginTop: 20,
  }
}