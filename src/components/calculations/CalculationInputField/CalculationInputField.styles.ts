import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, radius, typography } from "../../../helpers/variables";

export const calculationInputFieldStyles = {
  field: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: 10,

    texts: {
      flex: 1,
      gap: 2,

      label: {
        ...typography.ztNature.cardTitle,
        color: app_colors.primary.main,
      },

      description: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },

    valueContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 4,
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.badge32,
      paddingVertical: 8,
      paddingHorizontal: 12,

      value: {
        ...typography.ztNature.numericValue,
        color: app_colors.primary.main,
        minWidth: 40,
        textAlign: "right" as const,
        padding: 0,
      },

      unit: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },
  },
};
