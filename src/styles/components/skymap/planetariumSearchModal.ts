import {app_colors} from "../../../helpers/constants";
import {StatusBar} from "react-native";
import Constants from "expo-constants";

export const planetariumSearchModalStyles = {
  modal: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: app_colors.black,
    zIndex: 1000,

    display: "flex" as "flex",
    flexDirection: "column" as "column",

    paddingTop: Constants.statusBarHeight ? Constants.statusBarHeight + 20 : 20,

    header: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      gap: 10,
    },

    body: {
      flex: 1,
      display: "flex" as "flex",
      flexDirection: "column" as "column",
    }
  }
}