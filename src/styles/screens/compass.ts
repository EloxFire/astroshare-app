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
        fontSize: 20,
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
      }
    },

    compass: {
      height: 300,
      width: 300,
      borderRadius: 300,

      dialImage: {
        position: "absolute" as "absolute",
        height: 300,
        width: 300,
      }
    },

    gyroscope: {
      height: 300,
      width: 300,
    }
  }
}