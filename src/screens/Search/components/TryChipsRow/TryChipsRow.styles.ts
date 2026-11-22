import { app_colors, radius, spacing } from "../../../../helpers/variables";

export const tryChipsRowStyles = {
  content: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
    paddingVertical: 2,
  },

  chip: {
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.pill,
    paddingVertical: spacing.chip.vertical,
    paddingHorizontal: spacing.chip.horizontal + 4,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 12,
      color: app_colors.primary.main,
    },
  },
};
