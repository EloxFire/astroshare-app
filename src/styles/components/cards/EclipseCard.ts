import {app_colors} from "../../../helpers/constants";

export const eclipseCardStyles = {
  card: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: app_colors.white_twenty,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    alignItems: "center" as "center",

    infos: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      flex: 1,
      paddingLeft: 10,
      marginLeft: 10,
      borderLeftWidth: 1,
      borderLeftColor: app_colors.white_twenty,

      passed: {
        color: app_colors.red,
        fontFamily: "DMMonoMedium",
        fontSize: 10,
        textTransform: "uppercase" as "uppercase",
      },

      title: {
        color: app_colors.white,
        fontFamily: "GilroyBlack",
        textTransform: "uppercase" as "uppercase",
        fontSize: 18
      },

      subtitle: {
        color: app_colors.white_sixty,
        fontFamily: "GilroyRegular",
        fontSize: 14
      }
    }
  }
}