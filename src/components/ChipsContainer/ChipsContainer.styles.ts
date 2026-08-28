import { app_colors, radius } from "../../helpers/variables";

export const chipsContainerStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,


    chip: {
      backgroundColor: app_colors.accent.light,
      flex: 1,
      borderRadius: radius.heroCard,
      padding: 10,

      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 5,

      title: {
        color: app_colors.primary.medium,
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as const,
      },

      value: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 20,
      }
    }
    
  }
}