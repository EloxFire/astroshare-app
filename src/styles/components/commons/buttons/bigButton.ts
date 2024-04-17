import { app_colors } from "../../../../helpers/constants";
import { RPH, RPW } from "../../../../helpers/scripts/getScreenPercentage";

export const bigButtonStyles = {
  button: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    width: '100%' as '100%',
    marginBottom: 10,
    height: 65,

    icon: {
      width: 35,
      height: 35,
      marginRight: 10,
    },

    text: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyMedium',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      opacity: .6,
      fontSize: 12,
      fontFamily: 'AuxMono',
    }
  }
}