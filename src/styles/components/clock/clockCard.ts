import { app_colors } from "../../../helpers/constants";

export const clockCardStyles = {
  card: {
    width: '100%' as '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    paddingVertical: 14,
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
      opacity: 0.28,
    },

    content: {
      position: 'relative' as 'relative',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      gap: 14,
      zIndex: 1,
    },

    left: {
      flex: 1,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 6,

      label: {
        fontSize: 12,
        textTransform: 'uppercase' as 'uppercase',
        color: app_colors.white,
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        letterSpacing: 1.2,
      },

      time: {
        fontSize: 34,
        lineHeight: 34,
        color: app_colors.white,
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
        letterSpacing: -0.5,
      },

      meta: {
        fontSize: 13,
        color: app_colors.white_eighty,
        fontFamily: 'GilroyRegular' as 'GilroyRegular',
      },

      date: {
        fontSize: 13,
        color: app_colors.white_sixty,
        fontFamily: 'GilroyRegular' as 'GilroyRegular',
      },
    },

    analogWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      backgroundColor: app_colors.black,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      padding: 8,
    },
  },
};
