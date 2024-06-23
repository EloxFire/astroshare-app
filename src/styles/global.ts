import { StatusBar } from "react-native";
import { app_colors } from "../helpers/constants";

export const globalStyles = {
  body: {
    backgroundColor: app_colors.black,
    color: app_colors.white,
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20,
    height: "100%" as "100%",
    paddingBottom: 50,
  },
  input: {
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    color: app_colors.white,
  },
  sections: {
    marginVertical: 10,

    title: {
      color: app_colors.white,
      fontSize: 20,
      fontFamily: "GilroyBlack",
      textTransform: "uppercase" as "uppercase",
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 10,
      marginBottom: 10,
      fontFamily: "AuxMono",
      opacity: 0.6,
      textTransform: "uppercase" as "uppercase",
    },
  },
  screens: {
    title: {
      color: app_colors.white,
      fontSize: 24,
      fontFamily: "GilroyBlack",
      textTransform: "uppercase" as "uppercase",
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 9,
      marginBottom: 10,
      fontFamily: "AuxMono",
      opacity: 0.6,
      textTransform: "uppercase" as "uppercase",
    },

    separator: {
      height: 1,
      backgroundColor: app_colors.white_sixty,
      marginVertical: 10,
    },
  },
};
