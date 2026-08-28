import { app_colors, radius } from "../../../../helpers/variables";

export const observatoryCardStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: 10,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.heroCard,
    padding: 10,

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 14,
      color: app_colors.primary.main,
    },

    badge: {
      backgroundColor: app_colors.accent.main,
      color: app_colors.white,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: radius.heroCard,
    },

    subtitleRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,
      marginBottom: 10,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },

    active: {
      borderColor: app_colors.accent.main,
    },


    attributesRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      attribute: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 5,
  
        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 11,
          color: app_colors.primary.medium,
        },
      }
    }
  }
}