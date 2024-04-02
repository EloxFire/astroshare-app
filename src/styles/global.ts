import { StatusBar } from "react-native";
import { app_colors } from "../helpers/constants";

export const globalStyles = {
  body: {
    backgroundColor: app_colors.black,
    color: app_colors.white,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
    height: '100%' as '100%',
  },
  input: {
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    color: app_colors.white,
  },
  sections: {
    marginVertical: 10,

    title: {
      color: app_colors.white,
      fontSize: 25,
      fontFamily: 'AuxMono',
      textTransform: 'uppercase' as 'uppercase',
    }
  }
}