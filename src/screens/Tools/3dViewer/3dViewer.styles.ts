import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const threeDViewerScreenStyles = {
  featuredCard: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 20,
    marginBottom: 10,

    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 20,

    content: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,

      headline: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: "DMMonoRegular",
        color: app_colors.accent.light,
        textTransform: "uppercase" as const,
      },

      title: {
        fontSize: 25,
        fontFamily: "ZTNatureBold",
        color: app_colors.white,
      },

      description: {
        fontSize: 12,
        fontFamily: "DMMonoRegular",
        color: withOpacity(app_colors.white, 0.5),
      },
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: radius.heroCard,
      backgroundColor: withOpacity(app_colors.white, 0.2),
    }
  },

  modelsList: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  }
}