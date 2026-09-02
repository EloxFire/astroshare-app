import { app_colors, radius, spacing, typography, withOpacity } from "../../../../../helpers/variables";

export const dayDetailModalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: withOpacity(app_colors.black, 0.4),
    justifyContent: "flex-end" as const,
  },

  sheet: {
    backgroundColor: app_colors.white,
    borderTopLeftRadius: radius.modalSheetTop,
    borderTopRightRadius: radius.modalSheetTop,
    paddingTop: spacing.modalSheet.top,
    paddingHorizontal: spacing.modalSheet.horizontal,
    paddingBottom: spacing.modalSheet.bottom,

    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,

    image: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },

    infos: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 4,

      date: {
        color: app_colors.primary.medium,
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      },

      phase: {
        color: app_colors.primary.main,
        ...typography.ztNature.cardTitle,
        fontSize: 20,
      },

      subtitle: {
        color: app_colors.primary.medium,
        fontFamily: "DMMonoRegular",
        fontSize: 12,
      },
    },
  },
};
