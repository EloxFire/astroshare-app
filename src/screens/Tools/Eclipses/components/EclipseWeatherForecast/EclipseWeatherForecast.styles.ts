import { app_colors, radius } from "../../../../../helpers/variables";

export const eclipseWeatherForecastStyles = {
  container: {
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: 12,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  title: {
    fontFamily: "DMMonoRegular",
    fontSize: 9.5,
    color: app_colors.primary.medium,
    textTransform: "uppercase" as const,
  },

  message: {
    fontFamily: "DMMonoRegular",
    fontSize: 11.5,
    lineHeight: 11.5 * 1.4,
    color: app_colors.primary.medium,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: app_colors.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,

      icon: {
        width: 28,
        height: 28,
      },
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      row: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 6,
        flexWrap: "wrap" as const,
      },

      condition: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.primary.main,
      },

      dayLabel: {
        fontFamily: "DMMonoRegular",
        fontSize: 9.5,
        color: app_colors.primary.medium,
      },
    },
  },

  badge: {
    alignSelf: "flex-start" as const,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,

    text: {
      fontFamily: "DMMonoRegular",
      fontSize: 9.5,
    },
  },

  statsRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,

    stat: {
      minWidth: "22%" as const,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      label: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 3,

        text: {
          fontFamily: "DMMonoRegular",
          fontSize: 9,
          color: app_colors.primary.medium,
        },
      },

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 13,
        color: app_colors.primary.main,
      },
    },
  },

  hourly: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,

    title: {
      fontFamily: "DMMonoRegular",
      fontSize: 9.5,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },

    track: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,
    },

    chip: {
      alignItems: "center" as const,
      backgroundColor: app_colors.white,
      borderRadius: radius.badge32,
      paddingVertical: 6,
      paddingHorizontal: 8,
      gap: 2,
      borderWidth: 1,
      borderColor: "transparent",

      active: {
        borderColor: app_colors.accent.main,
      },

      time: {
        fontFamily: "DMMonoRegular",
        fontSize: 8.5,
        color: app_colors.primary.medium,
      },

      icon: {
        width: 22,
        height: 22,
      },

      temp: {
        fontFamily: "ZTNatureBold",
        fontSize: 11,
        color: app_colors.primary.main,
      },

      clouds: {
        fontFamily: "DMMonoRegular",
        fontSize: 8.5,
      },
    },
  },
};
