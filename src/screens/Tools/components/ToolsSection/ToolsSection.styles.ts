import { app_colors } from "../../../../helpers/variables";

export const toolsSectionStyles = {
  noResults: {
    paddingVertical: 30,
    display: "flex" as const,
    alignItems: "center" as const,

    text: {
      fontFamily: "DMMonoRegular",
      fontSize: 12,
      color: app_colors.primary.medium,
    }
  },

  list: {
    display: "flex" as const,
    paddingBottom: 80,

    category: {
      marginBottom: 20,
      display: "flex" as const,
      gap: 10,

      tools: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "flex-start" as const,
        flexWrap: "wrap" as const,
        gap: 10,
      }
    }
  }
}