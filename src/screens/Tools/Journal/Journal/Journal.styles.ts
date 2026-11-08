import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const journalScreenStyles = {
  sessionsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    
    stats: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
      marginTop: 10,
    },

    button: {
      backgroundColor: app_colors.white,
      borderRadius: radius.badge44,
      padding: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 10,
      borderWidth: 1,
      borderColor: app_colors.accent.light,

      text: {
        fontSize: 14,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.accent.main,
        marginLeft: 5,
      }
    },
  },

  observationsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginTop: 20,

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
      borderColor: app_colors.accent.light,

      text: {
        fontSize: 16,
        fontFamily: "ZTNatureRegular" as const,
        color: app_colors.primary.main,
        marginLeft: 5,
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

    // Raccourcis Statistiques / Matériel, deux IconButtonCard (fill) côte à côte.
    shortcuts: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
      marginTop: 10,
    },
  },

  recentSessionsList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginTop: 20,

    lastAchievementCard: {
      backgroundColor: app_colors.ambre.main,
      borderRadius: radius.heroCard,
      padding: 10,
      display: "flex" as const,
      flexDirection: "column" as const,
      marginTop: 10,

      header: {
        display: "flex" as const,
        flexDirection: 'row' as const,
        marginBottom: 10,

        infos: {
          display: "flex" as const,
          flexDirection: 'row' as const,
          alignItems: "center" as const,

          iconContainer: {
            display: "flex" as const,
            flexDirection: 'row' as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: app_colors.primary.main,
            marginRight: 10,
          },

          title: {
            fontSize: 20,
            lineHeight: 20,
            fontFamily: "ZTNatureBold" as const,
            color: app_colors.primary.main,
            marginTop: 5,
          },
  
          subtitle: {
            fontSize: 10,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.accent.main,
            textTransform: "uppercase" as const,
          }
        }
      },

      content: {
        display: "flex" as const,
        flexDirection: 'row' as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,

        progressContainer: {
          backgroundColor: withOpacity(app_colors.white, 0.5),
          padding: 10,
          borderRadius: radius.heroCard,
          flex: 1,
          display: "flex" as const,
          flexDirection: 'column' as const,

          text: {
            fontSize: 12,
            fontFamily: "DMMonoMedium" as const,
            color: app_colors.primary.main,
          },

          bar: {
            backgroundColor: app_colors.grey,
            height: 10,
            borderRadius: radius.heroCard,
            flex: 1,
            marginTop: 5,

            fill: {
              width: "70%" as const,
              backgroundColor: app_colors.primary.main,
              height: 10,
              borderRadius: radius.heroCard,
            }
          }
        }
      }
    },

    list: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
    }
  }
}