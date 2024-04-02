import { app_colors } from "../../helpers/constants";

export const bigValueStyles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start',
    justifyContent: 'center' as 'center',
    marginVertical: 5,
    
    value: {
      fontSize: 18,
      color: app_colors.white,
    },
    label: {
      fontSize: 18,
      fontFamily: 'AuxMono',
      color: app_colors.white,
    },
  },
}