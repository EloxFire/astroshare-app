import { StatusBar } from "react-native";
import { app_colors } from "../helpers/constants";

export const globalStyles = {
  body: {
    backgroundColor: app_colors.black,
    color: app_colors.white,
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20,
    height: "100%" as "100%",
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

    text: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: "GilroyRegular",
    }
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
  globalContainer: {
    backgroundColor: app_colors.white_no_opacity,
    borderColor: app_colors.white_no_opacity,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },

  proBadge:{
    margin: 0,

    star1:{
      position: 'absolute' as 'absolute',
      left: -5,
      top: -3,
      width: 7,
      height: 7,
    },

    star2:{
      position: 'absolute' as 'absolute',
      left: 20,
      top: -3,
      width: 5,
      height: 5,

    },

    star3:{
      position: 'absolute' as 'absolute',
      left: 25,
      top: 0,
      width: 8,
      height: 8,
    },

    star4:{
      position: 'absolute' as 'absolute',
      left: 3,
      top: 12,
      width: 5,
      height: 5,
    }
  }
};
