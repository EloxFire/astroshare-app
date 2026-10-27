import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const weatherScreenStyles = {
  cardDark: {
    backgroundColor: app_colors.primary.main,
    borderColor: app_colors.primary.main,

    refreshButton: {
      backgroundColor: withOpacity(app_colors.white, 0.2),
      padding: 5,
      borderRadius: radius.badge32
    },

    header: {
      title: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: "ZTNatureBold",
        textTransform: "uppercase" as const
      },

      subtitle: {
        color: app_colors.grey,
        fontSize: 10,
        fontFamily: "DMMonoMedium",
      }
    },

    body: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,
      // backgroundColor: app_colors.red.light,
      
      current: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "flex-end" as const,
        gap: 5,

        temperature: {
          color: app_colors.yellow.main,
          fontSize: 35,
          fontFamily: "ZTNatureBold",
        },

        conditions: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 10,
          flex: 1,

          item: {
            display: "flex" as const,
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 3,

            value: {
              color: app_colors.white,
              fontSize: 14,
              fontFamily: "DMMonoMedium",
            }
          }
        }
      },

      currentConditions: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,

        icon: {
          width: 70,
          height: 70,
        },
        label: {
          color: app_colors.white,
          fontSize: 12,
          fontFamily: "DMMonoMedium",
          width: 120,
          textAlign: "center" as const,
        }
      }
    }
  },

  hourlyForecastContainer: {
    display: "flex" as const,
    flexDirection: 'row' as const,
    gap: 10,
  }
}