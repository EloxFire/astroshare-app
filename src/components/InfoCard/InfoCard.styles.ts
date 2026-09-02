import { app_colors, radius } from "../../helpers/variables";

export const infoCardStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 10,

    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,

    infos: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      gap: 5,

      title: {
        color: app_colors.white,
        fontFamily: "ZTNatureBold",
        fontSize: 14,
      },

      description: {
        color: app_colors.white,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
      }
    }
  }
}