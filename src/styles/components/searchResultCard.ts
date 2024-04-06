import { app_colors } from "../../helpers/constants";

export const searchResultCardStyles = {
  card: {
    // display: 'flex' as 'flex',
    // flexDirection: 'column' as 'column',
    padding: 10,
    marginRight: 10,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    width: 250,
    height: 200,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',

      title: {
        fontSize: 20,
        color: app_colors.white,
        marginBottom: 5,
        fontFamily: 'GilroyBlack'
      }
    }
  },
}