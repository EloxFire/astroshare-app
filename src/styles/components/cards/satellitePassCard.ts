import { app_colors } from "../../../helpers/constants";

export const satellitePassCardStyles = {
  card: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    gap: 10,
    height: 60,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,

    conditions: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      width: "30%" as "30%",
      gap: 10,

      icon: {
        width: 40,
        height: 40,
      },

      title: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: "DMMonoMedium",
      },

      subtitle: {
        color: app_colors.white_eighty,
        fontSize: 12,
        fontFamily: "GilroyRegular",
      },
    },


    infos: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      justifyContent: "space-between" as "space-between",
      alignItems: "center" as "center",
      flex: 1,
      gap: 15,
      paddingLeft: 10,
    }
  },

  column: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 5,

    title: {
      color: app_colors.white_eighty,
      fontSize: 12,
      fontFamily: "GilroyRegular",
    },

    value: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: "DMMonoMedium",
    }
  }
}