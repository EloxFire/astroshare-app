import { app_colors } from "../../helpers/variables";

export const passwordRequirementsChecklistStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
  },

  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },

  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: app_colors.accent.main,
    backgroundColor: "transparent",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    valid: {
      backgroundColor: app_colors.accent.main,
    }
  },

  label: {
    color: app_colors.primary.main,
    fontFamily: "DMMonoRegular",
    fontSize: 12,
  }
}
