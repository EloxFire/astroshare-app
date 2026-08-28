import { app_colors } from "../../helpers/variables";

export const switchButtonStyles = {
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center" as const,
  },
  enabled: {
    backgroundColor: app_colors.accent.main,
  },
  disabled: {
    backgroundColor: app_colors.accent.light,
  },
  switchCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: app_colors.white,
  },
  circleEnabled: {
    alignSelf: "flex-end" as const,
  },
  circleDisabled: {
    alignSelf: "flex-start" as const,
  },
};