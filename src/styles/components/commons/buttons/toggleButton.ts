import { app_colors } from "../../../../helpers/constants";

export const toggleButtonStyles = {
  toggleButton: {
    marginBottom: 5,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    title: {
      fontSize: 12,
      fontFamily: 'AuxMono',
      color: app_colors.white,
      opacity: .5,
    },

    image: {
      width: 40,
      height: 40,
    },

  }
}