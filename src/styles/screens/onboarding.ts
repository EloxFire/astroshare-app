import { app_colors } from "../../helpers/constants";

export const onboardingStyles = {
  title: {
    textAlign: 'center' as 'center',
    marginBottom: 20,
    fontSize: 40,
    fontFamily: 'GilroyBlack',
    color: app_colors.white,
    textTransform: 'uppercase' as 'uppercase'
  },

  subtitle: {
    textAlign: 'center' as 'center',
    fontSize: 15,
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
  },

  text: {
    fontSize: 15,
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
    lineHeight: 18,
  },

  listText: {
    fontSize: 15,
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
    marginBottom: 10,
  },
}