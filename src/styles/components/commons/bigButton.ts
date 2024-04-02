import { app_colors } from "../../../helpers/constants";
import { RPH, RPW } from "../../../helpers/scripts/getScreenPercentage";

export const bigButtonStyles = {
  button: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    width: 130,
    height: 130,

    icon: {
      width: 40,
      height: 40,
      marginBottom: 10,
    },

    text: {
      color: app_colors.white,
      fontSize: 18,
      textAlign: 'center' as 'center',
      fontFamily: 'AuxMono',
    }
  }
}