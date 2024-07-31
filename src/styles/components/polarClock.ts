import { app_colors } from "../../helpers/constants";

export const polarClockStyles = {
  container: {
    // backgroundColor: '#FF22FF20',
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    alignItems: "center" as "center",
    padding: 10,
    height: "100%" as "100%",
  },

  text: {
    color: app_colors.red_eighty,
    fontSize: 15,
    textAlign: "center" as "center",
    fontFamily: "GilroyRegular",
  },

  button: {
    backgroundColor: app_colors.white_no_opacity,
    height: 30,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    flex: 1,
    borderRadius: 10,
    padding: 5,

    text: {
      color: app_colors.black,
      fontSize: 15,
      fontFamily: "GilroyRegular",
    }
  },

  south: {
    text: {
      color: app_colors.white,
      fontSize: 25,
      textAlign: "center" as "center",
      fontFamily: "GilroyBlack",
      marginTop: 10,
      marginBottom: 10,
      textTransform: "uppercase" as "uppercase",
    }
  }
}