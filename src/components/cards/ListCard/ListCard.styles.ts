import { app_colors, radius } from "../../../helpers/variables";

export const listCardStyles = {
  card: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    item: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,

      title: {
        color: app_colors.primary.medium,
        fontFamily: "ZTNatureRegular",
        fontSize: 14,
      },

      value: {
        color: app_colors.primary.main,
        fontFamily: "DMMonoMedium",
        fontSize: 14,
      },

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.primary.light,
        paddingBottom: 10,
      }
    }
  }
}