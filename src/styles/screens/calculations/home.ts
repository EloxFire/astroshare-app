import {app_colors} from "../../../helpers/constants";

const containerBase = {
  display: 'flex' as 'flex',
  flexDirection: 'column' as 'column',
  backgroundColor: app_colors.white_no_opacity,
  borderWidth: 1,
  borderColor: app_colors.white_twenty,
  borderRadius: 10,
  padding: 10,
}

export const calculationHomeStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,

    input:{
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      color: app_colors.white,
      backgroundColor: app_colors.white_no_opacity,
      minWidth: 140,
      maxWidth: 140,
      margin: 0,
      marginBottom: 5,
      fontSize: 12,
    },

    container: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      padding: 10,
    },

    title: {
      fontSize: 18,
      fontFamily: 'GilroyBlack',
      color: app_colors.white
    },

    description: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
      opacity: .5,
    },

    text: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
    },

    focalContainer: {
      ...containerBase
    },

    magnificationContainer: {
      ...containerBase
    },

    minimumMagnificationContainer: {
      ...containerBase
    },

    samplingContainer: {
      ...containerBase
    }
  }
}