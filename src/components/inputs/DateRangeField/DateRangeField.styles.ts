import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing, withOpacity } from "../../../helpers/variables";

export const dateRangeFieldStyles = {
  dateRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    field: {
      flex: 1,
      backgroundColor: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      borderRadius: radius.mediumCard,
      padding: spacing.toolCard,

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 9.5,
        color: app_colors.primary.medium,
        textTransform: "uppercase" as const,
        marginBottom: 4,
      },

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },
    },
  },

  // Même structure que le panneau iOS de AddSession (date/heure de session) — ici date seule.
  pickerSheet: {
    backdrop: {
      flex: 1,
      justifyContent: "flex-end" as const,
      backgroundColor: withOpacity(app_colors.black, 0.4),
    },

    dismissArea: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    container: {
      backgroundColor: app_colors.white,
      borderTopLeftRadius: radius.modalSheetTop,
      borderTopRightRadius: radius.modalSheetTop,
      paddingTop: spacing.modalSheet.top,
      paddingHorizontal: spacing.modalSheet.horizontal,
      gap: 12,

      header: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: gaps.iconToText,

        title: {
          ...globalStyles.categoryTitle,
          flex: 1,
        },
      },

      doneButton: {
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.accent.main,
        paddingVertical: spacing.pillButtonPrimary.vertical,
        borderRadius: radius.badge32,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 14,
          color: app_colors.white,
        },
      },
    },
  },
};
