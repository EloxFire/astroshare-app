import {app_colors} from "../../../helpers/constants";

export const planetariumResultCardStyles = {
  card: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.white_twenty,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    alignItems: "center" as "center",

    icon: {
      width: 45,
      height: 45,
    },

    data: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between" as "space-between",
      marginLeft: 10,
      flex: 1,

      title: {
        fontSize: 16,
        color: app_colors.white,
        fontFamily: "GilroyBlack",
        textTransform: "uppercase" as "uppercase",
      },

      badges: {
        display: "flex" as "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start" as "flex-start",
        marginTop: 5,
        gap: 10,
      }
    }
  }
}