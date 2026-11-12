import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing } from "../../../../../../helpers/variables";

export const addCameraStyles = {
  form: {
    marginTop: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    formBlock: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 5,
      marginBottom: 20,
    },

    formRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },

    label: {
      ...globalStyles.categoryTitle,
      fontSize: 12,
    },

    chipsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,

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

        active: {
          backgroundColor: app_colors.primary.main,
          borderColor: app_colors.primary.main,

          text: {
            color: app_colors.white,
          },
        },
      },
    },

    numberField: {
      ...globalStyles.defaultCard,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      label: {
        fontFamily: "DMMonoMedium",
        fontSize: 14,
        color: app_colors.primary.main,

        required: {
          color: app_colors.red.main,
        },
      },

      valueContainer: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "flex-end" as const,
        gap: 4,

        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 28,
          color: app_colors.primary.main,
          minWidth: 50,
          textAlign: "right" as const,
          padding: 0,
        },

        unit: {
          fontFamily: "DMMonoMedium",
          fontSize: 14,
          color: app_colors.primary.medium,
          marginBottom: 3,
        },
      },
    },

    actions: {
      marginTop: 20,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,

      saveButton: {
        ...globalStyles.button,
      },

      deleteButton: {
        backgroundColor: app_colors.red.light,
        padding: 10,
        borderRadius: radius.badge32,
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 10,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 14,
          lineHeight: 16,
          color: app_colors.red.main,
        },
      },
    },
  }
}
