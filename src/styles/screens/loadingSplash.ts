import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const loadingSplashStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    height: Dimensions.get('screen').height,
    backgroundColor: app_colors.black
  }
}