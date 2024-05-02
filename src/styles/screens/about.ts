import { app_colors } from "../../helpers/constants";

export const aboutStyles = {
  title: {
    fontSize: 25,
    marginBottom: 10,
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    textTransform: 'uppercase' as 'uppercase',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    textTransform: 'uppercase' as 'uppercase',
  },
  text: {
    fontSize: 16,
    color: app_colors.white,
    fontFamily: 'GilroyRegular'
  },
  row: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  chip: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: app_colors.white_forty,
    color: app_colors.white,
    borderRadius: 8,
    fontFamily: 'GilroyMedium',
  }
}