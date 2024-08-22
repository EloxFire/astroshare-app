import { app_colors } from "../../helpers/constants";

export const favouriteScreenStyles = {
  noFavsBadge: {
    color: app_colors.white,
    fontSize: 12,
    fontFamily: 'GilroyMedium',
    textAlign: 'center' as 'center',
    backgroundColor: app_colors.white_no_opacity,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
  },

  listButton: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.white_twenty,
    borderRadius: 10,
    marginBottom: 10,

    text: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
    },

    icon: {
      width: 24,
      height: 24,
    }
  }
}