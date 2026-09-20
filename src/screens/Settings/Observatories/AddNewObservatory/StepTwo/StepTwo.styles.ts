import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors, radius, withOpacity } from "../../../../../helpers/variables";

export const addNewObservatoryStepTwoStyles = {
  skyQualityContainer: {
    ...globalStyles.defaultCard,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
      gap: 10,

      bortleNumber: {
        color: app_colors.accent.main,
        fontFamily: "ZTNatureBold",
        fontSize: 35,
        lineHeight: 35,
        marginHorizontal: 10,
      },
      
      bortleIndicator: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 16,
      },
      
      bortleDescription: {
        color: app_colors.primary.medium,
        fontSize: 12,
        fontFamily: "DMMonoMedium",
      }
    },

    bortleScale: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginTop: 10,

      numberButton:{
        width: 32,
        height: 32,
        borderRadius: radius.badge32,
        backgroundColor: withOpacity(app_colors.grey, 0.5),
        alignItems: "center" as const,
        justifyContent: "center" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 16,
        }
      },

      colorLine: {
        width: '100%' as const,
        height: 5,
        borderRadius: radius.badge32,
      },

      scaleExtremes: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 10,
          color: app_colors.primary.medium,
        }
      },

      sqmContainer: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.medium,
        },

        value: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.main,
        }
      }
    }
  },

  observatoryTypeContainer: {
    ...globalStyles.defaultCard,
  }
}