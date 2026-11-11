import { app_colors, radius } from "../../../../helpers/variables";

export const gearScreenStyles = {
  setupsSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    noSetups: {
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: 10,

      text: {
        fontFamily: "DMMonoRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
        textAlign: "center" as const,
      },

      button: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.accent.main,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: radius.badge32,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.white,
          marginLeft: 5,
        }
      }
    }
  },

  detailedGearSection: {
    display: "flex" as const,
    flexDirection: "column" as const,
    marginBottom: 20,

    section: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,
      paddingBottom: 20,

      header: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,

        titleContainer: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 10,

          icon: {
            padding: 10,
            borderRadius: radius.badge32,
            backgroundColor: app_colors.accent.light,
          }
        }
      },

      content: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 10,

        noItems: {
          display: "flex" as const,
          flexDirection: "column" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          flex: 1,
          gap: 10,

          text: {
            fontFamily: "DMMonoRegular",
            fontSize: 12,
            color: app_colors.primary.medium,
          }
        }
      }
    }
  }
}