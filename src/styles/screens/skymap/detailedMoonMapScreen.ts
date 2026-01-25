import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const detailedMoonMapScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,

    scene: {
      width: Dimensions.get('window').width - 20,
      height: Dimensions.get('window').width - 20,
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      overflow: 'hidden' as 'hidden',
    }
  }
}