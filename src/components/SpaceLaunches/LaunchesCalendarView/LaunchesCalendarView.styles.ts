import { app_colors, radius } from "../../../helpers/variables";

export const launchesCalendarViewStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,

    arrow: {
      width: 32,
      height: 32,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    arrowLabel: {
      color: app_colors.primary.main,
      fontSize: 22,
      fontFamily: "ZTNatureBold",
    },

    title: {
      color: app_colors.primary.main,
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      textTransform: "capitalize" as const,
    },
  },

  weekdaysRow: {
    display: "flex" as const,
    flexDirection: "row" as const,

    label: {
      flex: 1,
      textAlign: "center" as const,
      color: app_colors.primary.medium,
      fontFamily: "DMMonoMedium",
      fontSize: 11,
      textTransform: "uppercase" as const,
    },
  },

  grid: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 4,
  },

  weekRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 4,
  },

  dayCell: {
    flex: 1,
    aspectRatio: 0.9,
    borderRadius: radius.mediumCard,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 4,
    padding: 2,

    dayNumber: {
      color: app_colors.primary.main,
      fontFamily: "DMMonoMedium",
      fontSize: 12,
    },

    dots: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 2,
      height: 5,

      dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
      },
    },
  },

  dayCellToday: {
    borderWidth: 2,
    borderColor: app_colors.accent.main,
  },

  dayCellSelected: {
    backgroundColor: app_colors.primary.main,
    borderColor: app_colors.primary.main,
  },

  dayCellSelectedText: {
    color: app_colors.white,
  },

  dayCellOutside: {
    opacity: 0.3,
    borderColor: "transparent",
  },

  selectedDay: {
    marginTop: 8,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    title: {
      fontSize: 12,
      fontFamily: "ZTNatureBold" as const,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },

    empty: {
      fontSize: 14,
      fontFamily: "ZTNatureRegular" as const,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
      paddingVertical: 20,
    },
  },
};
