import { app_colors } from "../../../../helpers/constants";

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
    padding: 8,
    width: '100%' as '100%',
    marginBottom: 10,
    height: 55,

    icon: {
      width: 30,
      height: 30,
      marginRight: 10,
    },

    text: {
      color: app_colors.white,
      fontSize: 15,
      fontFamily: 'GilroyMedium',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      opacity: .6,
      fontSize: 10,
      fontFamily: 'AuxMono',
    }
  }
}