import { app_colors, radius } from "../../../helpers/variables";

export const suggestionCardStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: 15,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

    },
    
    content: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "row" as const,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        lineHeight: 16,
        color: app_colors.primary.main,
        marginBottom: 10,
      },

      description: {
        fontFamily: "ZTNatureRegular",
        fontSize: 14,
        color: app_colors.primary.main,
      }
    }
  }
}