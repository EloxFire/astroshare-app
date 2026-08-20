import { app_colors, radius, typography } from "../../../../helpers/variables";

export const addPinnedToolButtonStyles = {
  button: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 4,

    square: {
      // backgroundColor: app_colors.accent.light,
      height: 54,
      width: 54,
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: app_colors.primary.main,
      borderRadius: radius.badge44,
      borderStyle: "dashed" as const,
    },

    name: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 12,
    }
  }
}