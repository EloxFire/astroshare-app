import { app_colors } from "../../../../helpers/variables";

export const toolsSectionStyles = {
  list: {
    display: "flex" as const,
    paddingBottom: 80,

    category: {
      marginBottom: 20,

      header: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 10,
        marginBottom: 10,

        title: {
          textTransform: "uppercase" as const,
          fontFamily: "DMMonoMedium" as const,
          fontSize: 14,
          color: app_colors.primary.main,
        },

        separator: {
          flex: 1,
          height: 1,
          backgroundColor: app_colors.grey,
        },

        subtitle: {
          fontFamily: "ZTNatureRegular" as const,
          color: app_colors.primary.main,
          fontSize: 10,
        }
      },

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