import { app_colors, radius, withOpacity } from "../../helpers/variables";

export const downloadButtonStyles = {
  button: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: app_colors.accent.main,
    borderRadius: radius.badge44,
    alignSelf: "flex-start" as const,

    disabled: {
      backgroundColor: withOpacity(app_colors.accent.main, 0.5),
    },

    text: {
      fontSize: 12,
      fontFamily: "DMMonoRegular",
      color: app_colors.white,
    }
  }
}
