export const toolsSectionStyles = {
  list: {
    display: "flex" as const,
    paddingBottom: 80,

    category: {
      marginBottom: 20,

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