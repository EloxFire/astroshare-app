import { app_colors } from "../../helpers/constants";

export const compassStyles = {
  content: {
    marginTop: 40,
    alignItems: 'center' as 'center',

    header: {
      marginTop: 20,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      height: '100%' as '100%',

      title: {
        fontSize: 30,
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
      }
    },

    compass: {
      height: 300,
      width: 300,
      borderRadius: 300,

      mainNeedle: {
        position: 'absolute' as 'absolute',
        top: 150,
        left: 145,
        width: 150,
        height: 1,
        backgroundColor: app_colors.red,
        transformOrigin: '0 0'
      }
    },

    gyroscope: {
      height: 300,
      width: 300,
    }
  }
}