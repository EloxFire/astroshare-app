import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const weatherSummaryStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      title: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: "ZTNatureBold",
        textTransform: "uppercase" as const
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: "DMMonoRegular",
      },

      button: {
        padding: 5,
        backgroundColor: withOpacity(app_colors.white, 0.2),
        borderRadius: radius.badge32,
      }
    },

    body: {
      marginTop: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,

      iconContainer: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        gap: 5,
        flex: 1,
        // backgroundColor: withOpacity(app_colors.red.main, 0.2),

        icon: {
          width: 90,
          height: 90,
        },

        description: {
          color: app_colors.white,
          fontSize: 12,
          fontFamily: "DMMonoRegular",
        }
      },

      conditions: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        gap: 5,
        flex: 1,
        // backgroundColor: withOpacity(app_colors.white, 0.2),

        main: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 5,

          text: {
            color: app_colors.yellow.main,
            fontSize: 35,
            fontFamily: "ZTNatureBold",
          }
        },

        row: {
          display: "flex" as const,
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          gap: 10,
        },

        item: {
          flex:1,
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "flex-start" as const,
          gap: 10,
          // backgroundColor: withOpacity(app_colors.white, 0.2),

          reverse: {
            flexDirection: "row-reverse" as const,
          },

          text: {
            color: app_colors.white,
            fontSize: 16,
            fontFamily: "DMMonoMedium",
          }
        }
      }
    }
  }
}