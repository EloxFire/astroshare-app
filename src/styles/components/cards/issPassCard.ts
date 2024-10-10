import { app_colors } from "../../../helpers/constants";

export const issPassCardStyles = {
  card: {
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',

      title:{
        color: app_colors.white,
        fontSize: 15,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        marginBottom: 10
      },
    },
  }
}