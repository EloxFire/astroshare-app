import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const resourceCardStyles = {
  card: {
    width: "100%" as "100%",
    height: 180,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,

    image: {
      borderRadius: 10,
    },
    
    gradientContainer: {
      position: "relative" as "relative",
      padding: 10,
      borderRadius: 10,
      height: 180,
      justifyContent: "flex-end" as "flex-end",
    },

    title: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: "GilroyBlack",
    },

    description: {
      color: app_colors.white_eighty,
      fontSize: 12,
      fontFamily: "DMMonoRegular",
    },

    level: {
      position: "absolute" as "absolute",
      top: 10,
      right: 10,
      backgroundColor: app_colors.black_sixty,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 5,
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      columnGap: 4,

      text: {
        color: app_colors.white,
        fontSize: 12,
        fontFamily: "DMMonoRegular",
      }
    },

    timeToRead: {
      position: "absolute" as "absolute",
      top: 10,
      left: 10,
      alignSelf: "flex-start" as "flex-start",
      backgroundColor: app_colors.black_sixty,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 5,
    }
  }
}
