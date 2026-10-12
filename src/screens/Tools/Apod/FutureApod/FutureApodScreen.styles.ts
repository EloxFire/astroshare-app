import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const futureApodScreenStyles = {
  screen: {
    backgroundColor: app_colors.primary.main,

    countdown: {
      width: "100%" as const,
      height: 300,
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 10,
      borderWidth: 1,
      borderColor: withOpacity(app_colors.white, 0.5),
      borderStyle: "dashed" as const,
      borderRadius: radius.heroCard,
      padding: 10,

      subtitle: {
        color: withOpacity(app_colors.white, 0.5),
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      },

      time: {
        fontFamily: "ZTNatureBold",
        fontSize: 40,
        color: app_colors.yellow.main,
        textAlign: "center" as const,
      },

      date: {
        color: withOpacity(app_colors.white, 0.5),
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      }
    }
  }
}