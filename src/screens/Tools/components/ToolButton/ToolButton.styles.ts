import { Dimensions } from "react-native";
import { app_colors, radius, spacing } from "../../../../helpers/variables";

export const toolButtonStyles = {
  button: {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    padding: 10,
    borderRadius: radius.badge44,
    width: Dimensions.get("window").width / 3 - 20,
    height: (Dimensions.get("window").width / 3 - 20) * 0.8,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,

      icon: {
        width: 20,
        height: 20,
        color: app_colors.primary.main
      }
    },
    title: {
      fontFamily: "ZTNatureBold",
      color: app_colors.primary.main,
      fontSize: 14,
    }
  }
}
