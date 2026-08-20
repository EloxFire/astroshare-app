import { app_colors, gaps, radius, typography } from "../../../../helpers/variables";

export const toolButtonStyles = {
  button: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: gaps.gridTile.columns,

    square: {
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.badge44,
      height: 54,
      width: 54,
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },

    name: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 12,
    }
  }
}