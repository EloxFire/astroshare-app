import { app_colors, radius, spacing, typography, withOpacity } from "../../../../helpers/variables";

export const currentConditionsStyles = {
  container: {
    paddingHorizontal: spacing.banner.horizontal,
    paddingVertical: spacing.banner.vertical,
    borderRadius: radius.heroCard,
    backgroundColor: app_colors.yellow.light,

    blocs: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: spacing.banner.horizontal,

      bloc: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: spacing.banner.horizontal,
        
        textContainer: {
          display: "flex" as const,
          flexDirection: "column" as const,
          justifyContent: "center" as const,

          title: {
            fontSize: 10,
            color: app_colors.primary.main,
            textTransform: "uppercase" as const,
          },
          value: {
            ...typography.dmMono.semiBold,
            fontSize: 22,
            color: app_colors.primary.main,
            fontWeight: "bold" as const,
          }
        },

        withBorder: {
          borderRightWidth: 1,
          borderRightColor: withOpacity(app_colors.primary.main, 0.2),
        }
      },
    }
  }
}