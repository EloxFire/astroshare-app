import { app_colors } from "../../helpers/variables";

export const checkboxStyles = {
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: app_colors.accent.main,
    backgroundColor: app_colors.white,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    checked: {
      backgroundColor: app_colors.accent.main,
    }
  }
}
