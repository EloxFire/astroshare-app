import { app_colors, gaps, radius, spacing, typography } from "../../../helpers/variables";

export const fieldSimulatorScreenStyles = {
  angularSizeCaption: {
    ...typography.dmMono.regular.rowMeta,
    color: app_colors.primary.medium,
    textAlign: "right" as const,
  },

  pillsRow: {
    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,
      paddingVertical: 2,
    },

    pill: {
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

      active: {
        backgroundColor: app_colors.primary.main,
        borderColor: app_colors.primary.main,

        text: {
          color: app_colors.white,
        },
      },
    },
  },

  hero: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 16,
  },

  emptyState: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 10,

    text: {
      ...typography.dmMono.regular.cardBody,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },

  searchRow: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: gaps.iconToText,
  },
};
