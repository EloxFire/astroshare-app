import {app_colors} from "../../../helpers/constants";

export const proFeatureCardStyles = {
  card: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,

    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: app_colors.white_twenty,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      flexShrink: 0,
    },

    icon: {
      width: 20,
      height: 20,
      tintColor: app_colors.white,
    },

    textContainer: {
      flex: 1,
    },

    title: {
      color: app_colors.white,
      fontSize: 13,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
    },

    description: {
      color: app_colors.white,
      fontSize: 12,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      opacity: 0.6,
      marginTop: 3,
      lineHeight: 17,
    },
  }
}
