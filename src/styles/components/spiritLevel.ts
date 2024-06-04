import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const spiritLevelStyles = {
  container: {
    display: "flex" as "flex",
    justifyContent: "center" as "center",
    alignItems: "center" as "center",
    marginTop: 25,
    // backgroundColor: "#FF22FF20",
    width: Dimensions.get('screen').width - 50,
    height: Dimensions.get('screen').width - 50,
    borderRadius: (Dimensions.get('screen').width - 50) / 2,
    borderWidth: 2,
    borderColor: app_colors.red_eighty,
    position: "relative" as "relative",

    gyroDot: {
      backgroundColor: app_colors.red_eighty,
      width: 20,
      height: 20,
      borderRadius: 30,
    },

    gyroDotFixed: {
      backgroundColor: app_colors.white_eighty,
      width: 20,
      height: 20,
      borderRadius: 30,
      position: "absolute" as "absolute",
      top: "50%" as "50%",
      left: "50%" as "50%",
      transform: [{ translateX: -15 }, { translateY: -15 }],
    }
  }
}