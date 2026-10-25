import { app_colors, radius } from "../../../helpers/variables";

export const noaaScaleCardStyles = {
  card: {
    backgroundColor: app_colors.accent.light,
    flex: 1,
    borderRadius: radius.heroCard,
    padding: 10,

    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    gap: 5,

    title: {
      color: app_colors.primary.medium,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
      textTransform: "uppercase" as const,
      marginBottom: 10,
    },

    value: {
      color: app_colors.primary.main,
      fontFamily: "ZTNatureBold",
      fontSize: 20,
    },
    subtitle: {
      color: app_colors.primary.main,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
    }
  }
}