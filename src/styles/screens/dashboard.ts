import { app_colors } from "../../helpers/constants";

export const dashboardStyles = {
  content: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 12,
    paddingBottom: 70,
  },

  section: {
    backgroundColor: app_colors.black,
    borderColor: app_colors.white_twenty,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },

  sectionHeader: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "space-between" as "space-between",
    gap: 8,
  },

  sectionTitle: {
    color: app_colors.white,
    fontFamily: "GilroyBlack" as "GilroyBlack",
    fontSize: 16,
  },

  sectionSubtitle: {
    color: app_colors.white_sixty,
    fontFamily: "DMMonoRegular" as "DMMonoRegular",
    fontSize: 10,
  },

  statGrid: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    flexWrap: "wrap" as "wrap",
    gap: 8,
  },

  statCard: {
    container: {
      flex: 1,
      minWidth: "48%" as "48%",
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 0,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      padding: 10,
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      gap: 10,
    },

    icon: {
      width: 20,
      height: 20,
      tintColor: app_colors.white,
    },

    value: {
      color: app_colors.white,
      fontFamily: "GilroyBlack" as "GilroyBlack",
      fontSize: 18,
    },

    label: {
      color: app_colors.white_sixty,
      fontFamily: "DMMonoRegular" as "DMMonoRegular",
      fontSize: 11,
      marginTop: 1,
    },
  },

  progress: {
    wrapper: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      gap: 8,
    },

    bar: {
      height: 10,
      borderRadius: 10,
      backgroundColor: app_colors.white_twenty,
      overflow: "hidden" as "hidden",
    },

    fill: {
      height: "100%" as "100%",
      backgroundColor: app_colors.green_eighty,
    },

    text: {
      color: app_colors.white,
      fontFamily: "DMMonoRegular" as "DMMonoRegular",
      fontSize: 11,
    },
  },

  messierGrid: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 6,
  },

  messierCard: {
    container: {
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 0,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      gap: 4,
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      justifyContent: "space-between" as "space-between",
    },

    observed: {
      borderColor: app_colors.green_eighty,
      backgroundColor: app_colors.green_forty,
    },

    header: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      justifyContent: "flex-start" as "flex-start",
      alignItems: "center" as "center",
      gap: 6,
    },

    title: {
      color: app_colors.white,
      fontFamily: "GilroyBlack" as "GilroyBlack",
      fontSize: 13,
    },

    subtitle: {
      color: app_colors.white_eighty,
      fontFamily: "GilroyRegular" as "GilroyRegular",
      fontSize: 11,
    },

    actions: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      gap: 8,
    },

    actionIcon: {
      width: 20,
      height: 20,
      tintColor: app_colors.white,
    },
  },

  activities: {
    list: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      gap: 8,
    },

    item: {
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 0,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 10,
      gap: 4,
    },

    meta: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      justifyContent: "space-between" as "space-between",
    },

    title: {
      color: app_colors.white,
      fontFamily: "GilroyBlack" as "GilroyBlack",
      fontSize: 14,
      flex: 1,
    },

    time: {
      color: app_colors.white_sixty,
      fontFamily: "DMMonoRegular" as "DMMonoRegular",
      fontSize: 10,
      marginLeft: 8,
    },

    description: {
      color: app_colors.white,
      fontFamily: "GilroyRegular" as "GilroyRegular",
      fontSize: 12,
      lineHeight: 18,
    },
  },

  achievements: {
    grid: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      gap: 10,
    },

    card: {
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 0,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      gap: 6,
    },

    achieved: {
      borderColor: app_colors.green_forty,
      backgroundColor: app_colors.green_forty,
    },

    header: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      justifyContent: "space-between" as "space-between",
      gap: 10,
    },

    chevron: {
      width: 18,
      height: 18,
      tintColor: app_colors.white,
    },

    title: {
      color: app_colors.white,
      fontFamily: "GilroyBlack" as "GilroyBlack",
      fontSize: 14,
    },

    description: {
      color: app_colors.white_sixty,
      fontFamily: "GilroyRegular" as "GilroyRegular",
      fontSize: 11,
      lineHeight: 15,
    },
    progress: {
      marginTop: 6,
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      gap: 6,
    },
    progressText: {
      color: app_colors.white,
      fontFamily: "DMMonoRegular" as "DMMonoRegular",
      fontSize: 11,
    },

    nextStep: {
      marginTop: 10,
      backgroundColor: app_colors.white_no_opacity,
      padding: 6,
      borderRadius: 10,
      borderWidth: 1 ,
      borderColor: app_colors.white_twenty,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      title: {
        color: app_colors.white_sixty,
        fontFamily: "DMMonoRegular" as "DMMonoRegular",
        fontSize: 12,
        marginBottom: 5,
      },
      
      description: {
        fontFamily: "GilroyRegular" as "GilroyRegular",
        color: app_colors.white,
      }
    }
  },

  linkButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 0,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "space-between" as "space-between",

    text: {
      color: app_colors.white,
      fontFamily: "GilroyBlack" as "GilroyBlack",
      fontSize: 13,
      letterSpacing: 0.3,
    },

    icon: {
      width: 18,
      height: 18,
      tintColor: app_colors.white,
    },
  },

  loading: {
    marginTop: 4,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    gap: 10,

    text: {
      color: app_colors.white,
      fontFamily: "DMMonoRegular" as "DMMonoRegular",
      fontSize: 12,
    },
  },
};
