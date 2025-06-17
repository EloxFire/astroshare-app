import { app_colors } from "../../../helpers/constants";

export const objectCardLiteStyles = {
  card: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    alignItems: "center" as "center",

    header: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      alignItems: "flex-start" as "flex-start",
      marginBottom: 5,
    },

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

      subtitle: {
        fontSize: 12,
        color: app_colors.white,
        fontFamily: "DMMonoRegular",
      },

      badges: {
        display: "flex" as "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start" as "flex-start",
        marginTop: 5,
        gap: 5,
      }
    }
  }
}
