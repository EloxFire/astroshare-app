import { app_colors } from "../../../helpers/constants";

export const resourceDetailsStyles = {
  page: {
    paddingHorizontal: 0,
    // paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20,
    paddingTop: 0
  },

  title: {
    color: app_colors.white,
    fontSize: 24,
    fontFamily: 'GilroyBlack'
  },

  description: {
    color: app_colors.white,
    fontSize: 16,
    marginTop: 5,
    fontFamily: 'GilroyRegular'
  },

  gradientContainer: {
    position: "relative" as "relative",
    padding: 10,
    borderRadius: 10,
    height: 230,
    justifyContent: "flex-end" as "flex-end",
  },

  statusBarOverlay: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  infoBox: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
  }
}
