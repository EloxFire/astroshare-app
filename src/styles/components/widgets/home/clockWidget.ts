import { app_colors } from "../../../../helpers/constants";

export const clockWidgetStyles = {
  widget: {
    width: '100%' as '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: app_colors.white_no_opacity,
    overflow: 'hidden' as 'hidden',
    position: 'relative' as 'relative',

    overlay: {
      position: 'absolute' as 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: app_colors.black,
      opacity: 0.32,
    },

    content: {
      position: 'relative' as 'relative',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      gap: 18,
      alignItems: 'center' as 'center',
      zIndex: 1,
    },

    divider: {
      width: 1,
      backgroundColor: app_colors.white_twenty,
      opacity: 0.5,
      alignSelf: 'stretch' as 'stretch',
    },

    section: {
      flex: 1,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'space-around' as 'space-around',
      gap: 6,

      label: {
        fontSize: 11,
        textTransform: 'uppercase' as 'uppercase',
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
        letterSpacing: 1.5,
      },

      time: {
        fontSize: 24,
        lineHeight: 26,
        color: app_colors.white,
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
        letterSpacing: -0.5,
      },

      meta: {
        fontSize: 11,
        color: app_colors.white_eighty,
        fontFamily: 'GilroyRegular',
      },

      date: {
        fontSize: 11,
        color: app_colors.white_sixty,
        fontFamily: 'GilroyRegular',
      },
    },
  }
}
