import { StatusBar } from "react-native";
import { app_colors } from "../helpers/constants";

export const globalStyles = {
  body: {
    backgroundColor: app_colors.black,
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
    height: '100%' as '100%',
  }
}