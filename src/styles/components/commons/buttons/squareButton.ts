import { app_colors } from "../../../../helpers/constants";

export const squareButtonStyles = {
  button: {
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    height: 180,
    width: 180,
    position: 'relative' as 'relative',

    image: {
      position: 'absolute' as 'absolute',
      right: 0,
      bottom: 0,
      height: 180,
      width: 180,
      borderRadius: 10,
      opacity: .3,
    },

    text: {
      color: app_colors.white,
      fontSize: 25,
      fontFamily: 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 12,
      fontFamily: 'AuxMono',
      lineHeight: 18,
    }
  }
}