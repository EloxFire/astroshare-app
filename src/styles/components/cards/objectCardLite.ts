import { app_colors } from "../../../helpers/constants";

export const objectCardLiteStyles = {
  card: {
    backgroundColor: app_colors.white_no_opacity,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    gap: 10,
    marginBottom: 8,
    
    image: {
      width: 35,
      height: 35,
    },

    infos: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      flex: 1,


      title: {
        fontSize: 15,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },

      data: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        gap: 20,

        info: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',

          label: {
            fontSize: 10,
            fontFamily: 'GilroyBlack',
            color: app_colors.white_eighty,
          },

          value: {
            fontSize: 12,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        }
      }
    }
  }
}