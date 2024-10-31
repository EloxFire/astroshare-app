import {app_colors} from "../helpers/constants";

export const markdownStyles = {
  global: {
    body: {
      color: app_colors.white,
      fontSize: 16,
      lineHeight: 28,
    },
    heading1: {
      fontSize: 28,
      lineHeight: 28,
    },
    heading2: {
      fontSize: 22,
      lineHeight: 22,
    },
    heading3: {
      fontSize: 20,
      lineHeight: 20,
    },
    heading4: {
      fontSize: 18,
      lineHeight: 18,
    },
    code_inline: {
      backgroundColor: "transparent",
      fontFamily: 'AuxMono',
    },
    table: {
      borderColor: app_colors.white,
    },
    td: {
      borderColor: app_colors.white,
    },
    tr: {
      borderColor: app_colors.white,
    }
  },
  heading1: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
  },
  heading2: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
    marginTop: 30,
  },
  heading3: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
    marginTop: 30,
  },
  heading4: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
    marginTop: 30,
  },
  heading5: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
    marginTop: 30,
  },
  heading6: {
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
    color: app_colors.white,
    marginTop: 30,
  },
  blockquote: {
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderLeftWidth: 10,
    borderLeftColor: app_colors.white,
    paddingHorizontal: 10,
    marginTop: 20,
  },
}