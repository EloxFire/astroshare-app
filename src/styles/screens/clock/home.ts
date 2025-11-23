import { app_colors } from "../../../helpers/constants";

const cardBase = {
  borderRadius: 12,
  borderWidth: 1,
  borderColor: app_colors.white_no_opacity,
  paddingVertical: 14,
  paddingHorizontal: 16,
  backgroundColor: app_colors.white_no_opacity,
  overflow: 'hidden' as 'hidden',
  position: 'relative' as 'relative',
};

export const clockHomeStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 14,
    paddingBottom: 100,
  },

  pickerLabel: {
    fontSize: 12,
    color: app_colors.white_eighty,
    fontFamily: 'GilroyRegular',
  },

  dropdown: {
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center' as 'center',

    withIcon: {
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
    },

    text: {
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      fontSize: 15,
    },

    list: {
      backgroundColor: app_colors.black,
      marginTop: -50,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,

      item: {
        backgroundColor: app_colors.white_no_opacity,
        height: 50,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        gap: 20,
        paddingHorizontal: 30,
        alignItems: 'center' as 'center',
        borderBottomWidth: 1,
        borderBottomColor: app_colors.white_twenty,

        value: {
          fontFamily: 'GilroyRegular',
          fontSize: 15,
          color: app_colors.white,
        }
      }
    }
  },

  card: {
    ...cardBase,

    overlay: {
      position: 'absolute' as 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: app_colors.black,
      opacity: 0.3,
    },

    body: {
      position: 'relative' as 'relative',
      zIndex: 1,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      gap: 8,
    },

    label: {
      fontSize: 20,
      textTransform: 'uppercase' as 'uppercase',
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      letterSpacing: 1.2,
    },

    time: {
      fontSize: 36,
      lineHeight: 30,
      color: app_colors.white,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      letterSpacing: -0.5,
    },

    meta: {
      fontSize: 14,
      color: app_colors.white_eighty,
      fontFamily: 'GilroyRegular',
    },

    date: {
      fontSize: 14,
      color: app_colors.white_sixty,
      fontFamily: 'GilroyRegular',
    },
  },
};
