import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const satelliteIdCardStyles = {
  card: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    gap: 10,
    height: 60,
    width: Dimensions.get('window').width - 20,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,

    conditions: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      alignItems: "center" as "center",
      width: "100%" as "100%",
      gap: 10,

      icon: {
        width: 30,
        height: 30,
      },

      title: {
        color: app_colors.white,
        fontSize: 10,
        fontFamily: "DMMonoMedium",
      },

      subtitle: {
        color: app_colors.white_eighty,
        fontSize: 12,
        fontFamily: "GilroyRegular",
      },
    },


    infos: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      justifyContent: "flex-start" as "flex-start",
      alignItems: "center" as "center",
      flex: 1,
      gap: 15,
      paddingLeft: 10,
    }
  },

  column: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    gap: 5,

    title: {
      color: app_colors.white_eighty,
      fontSize: 12,
      fontFamily: "GilroyRegular",
    },

    value: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: "DMMonoMedium",
    }
  }
}