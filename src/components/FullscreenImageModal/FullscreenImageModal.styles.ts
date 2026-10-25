import { app_colors, withOpacity } from "../../helpers/variables";

export const fullscreenImageModalStyles = {
  container: {
    flex: 1,
    backgroundColor: app_colors.black,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  topActions: {
    position: "absolute" as const,
    top: 56,
    right: 20,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: withOpacity(app_colors.white, 0.15),
    },
  },
};
