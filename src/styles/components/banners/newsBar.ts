import {Dimensions} from "react-native";
import {app_colors} from "../../../helpers/constants";

export const newsBarStyles = {
  bar: {
    width: Dimensions.get("window").width - 20,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    padding: 10,

    icon: {
      width: 35,
      height: 35,
      marginRight: 10,
    },

    infos: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      justifyContent: "center" as "center",
      alignItems: "flex-start" as "flex-start",
      flex: 1,

      title:{
        fontSize: 16,
        color: app_colors.white,
        fontFamily: "GilroyBlack"
      },

      description:{
        fontSize: 12,
        color: app_colors.white,
        fontFamily: "DMMonoRegular",
      },
    }
  }
}