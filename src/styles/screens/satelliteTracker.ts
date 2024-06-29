import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const satelliteTrackerStyles = {
  mapContainer: {
    width: Dimensions.get('screen').width - 20,
    height: Dimensions.get('screen').width - 20,
    padding: 10,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,

    map: {
      width: '100%' as '100%',
      height: '100%' as '100%',
    }
  }
}