import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const polarScopeScreenStyles = {
  screen: {
    backgroundColor: app_colors.primary.main,
  },

  infoHeader: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },
  },

  scopeContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    flex: 1,
    gap: 10,
    marginVertical: 10,

    subtitle: {
      color: app_colors.accent.light,
      fontSize: 12,
      fontFamily: "DMMonoRegular",
      textTransform: "uppercase" as const,
    },
    value: {
      color: app_colors.yellow.light,
      fontSize: 40,
      lineHeight: 40,
      fontFamily: "ZTNatureBold",
    }
  },

  footer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 10,

    button: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      flex: 1,
      padding: 10,
      backgroundColor: app_colors.primary.main,
      borderRadius: radius.badge44,
      borderWidth: .5,
      borderColor: app_colors.accent.light,
      
      active: {
        backgroundColor: app_colors.accent.main,
        borderColor: app_colors.accent.main,
      },

      text: {
        color: app_colors.accent.light,
        fontSize: 16,
        fontFamily: "ZTNatureBold",
      },
    }
  }
}