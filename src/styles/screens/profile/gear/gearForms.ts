import { app_colors } from "../../../../helpers/constants";

export const gearFormsStyles = {
  label: {
    color: app_colors.white,
    fontSize: 14,
    fontFamily: "GilroyRegular",
  },
  formSection: {
    backgroundColor: app_colors.white_no_opacity,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    
    title: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: "GilroyBlack",
      marginBottom: 10,
    },

    formRow: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
    }
  }
}