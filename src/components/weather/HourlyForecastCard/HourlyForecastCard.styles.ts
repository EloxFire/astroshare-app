import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../helpers/variables";

export const hourlyForecastCardStyles = {
  card: {
    ...globalStyles.defaultCard,
    alignItems: "center" as const,

    weatherIcon: {
      width: 20,
      height: 20,
    },

    temp: {
      fontFamily: "ZTNatureBold",
      fontSize: 14,
      color: app_colors.primary.main,
      paddingHorizontal: 5,
    },

    time: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },

    scoreBar: {
      width: 6,
      height: 50,
      borderRadius: 3,
      backgroundColor: withOpacity(app_colors.primary.main, 0.08),
      overflow: "hidden" as const,
      justifyContent: "flex-end" as const,

      fill: {
        width: "100%" as const,
        borderRadius: 3,
      },
    },

    score: {
      fontFamily: "ZTNatureBold",
      fontSize: 14,
    }
  }
}