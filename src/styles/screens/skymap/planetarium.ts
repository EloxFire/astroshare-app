import { app_colors } from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const planetariumStyles = {
  loadingScreen: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: app_colors.black,
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    zIndex: 11
  },
  container: {
    backgroundColor: app_colors.black,
    flex: 1,
    position : 'relative' as 'relative',
    zIndex: 3
  }
}