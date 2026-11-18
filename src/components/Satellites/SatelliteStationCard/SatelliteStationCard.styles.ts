import { app_colors, radius, spacing, withOpacity } from "../../../helpers/variables";

export const satelliteStationCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    illustrationContainer: {
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      width: "25%" as const,
    },

    infos: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      gap: 10,

      label: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        color: withOpacity(app_colors.white, 0.8)
      },

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 20,
        color: app_colors.white
      },

      subtitle: {
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        color: withOpacity(app_colors.white, 0.8)
      },

      nextPassBadge: {
        backgroundColor: withOpacity(app_colors.white, 0.1),
        borderRadius: radius.heroCard,
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignSelf: "flex-start" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 10,
          color: app_colors.yellow.main
        }
      }
    }
  }
};
