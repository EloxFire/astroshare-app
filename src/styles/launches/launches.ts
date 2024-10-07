import {app_colors} from "../../helpers/constants";

export const launcheScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginTop: 10,
    paddingBottom: 50,

    lastUpdateText:{
      color: app_colors.white,
      opacity: 0.6,
      fontFamily: 'GilroyRegular',
      fontSize: 12,
      textAlign: 'center' as 'center',
      marginBottom: 10
    }
  }
}