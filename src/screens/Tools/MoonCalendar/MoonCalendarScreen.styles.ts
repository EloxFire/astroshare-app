import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, radius, typography } from "../../../helpers/variables";

export const moonCalendarScreenStyles = {
  screen: globalStyles.screen,
  content: globalStyles.screen.content,

  currentPhaseContainer: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 5,

    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,

    infos: {
      // backgroundColor: app_colors.accent.light,
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 5,

      subtitle: {
        color: app_colors.accent.light,
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      },

      phase: {
        color: app_colors.yellow.light,
        ...typography.ztNature.cardTitle,
        fontSize: 24,
      }
    }
  },

  lunarCycleProgressContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,

    progressBar: {
      backgroundColor: app_colors.accent.light,
      height: 12,
      borderRadius: 12,
      flex: 1,
      position: "relative" as const,
      overflow: "hidden" as const,

      progress: {
        backgroundColor: app_colors.accent.main,
        height: "100%" as const,
        width: "30%" as const,
        position: "absolute" as const,
        top: 0,
        left: 0,
      }
    },

    age: {
      color: app_colors.primary.main,
      fontFamily: "DMMonoMedium",
      fontSize: 12,
    }
  },

  mainInfoBlocs: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,

    bloc: {
      backgroundColor: app_colors.accent.light,
      flex: 1,
      borderRadius: radius.heroCard,
      padding: 10,

      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 5,

      title: {
        color: app_colors.primary.medium,
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as const,
      },

      value: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 20,
      }
    }
  },

  ephemerisContainer: {
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 10,
    marginTop: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    bloc: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,

      title: {
        color: app_colors.primary.medium,
        fontFamily: "ZTNatureRegular",
        fontSize: 14,
      },

      value: {
        color: app_colors.primary.main,
        fontFamily: "DMMonoMedium",
        fontSize: 14,
      },

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.primary.light,
        paddingBottom: 5,
      }
    }
  }
};
