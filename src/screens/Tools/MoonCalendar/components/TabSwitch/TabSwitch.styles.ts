import { app_colors, radius, typography } from "../../../../../helpers/variables";

export const tabSwitchStyles = {
  container: {
    backgroundColor: app_colors.primary.light,
    padding: 5,

    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 5,

    borderRadius: radius.badge44,

    tab: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      flex: 1,

      title: {
        ...typography.dmMono.semiBold.pillButton,
        fontSize: 12,
        textTransform: "uppercase" as const,
        color: app_colors.primary.medium,
        
        active: {
          color: app_colors.primary.main,
        }
      },

      active: {
        backgroundColor: app_colors.white,
      }
    }
  }
}