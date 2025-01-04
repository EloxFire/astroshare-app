import { StatusBar } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const planetariumStyles = {
  loadingScreen: {
    flex: 1,
    backgroundColor: app_colors.black,
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  container: {
    backgroundColor: app_colors.black,
    flex: 1,
    position : 'relative' as 'relative',
    zIndex: 3
  }
}