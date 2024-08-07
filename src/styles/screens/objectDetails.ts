import { tint } from "react-native-color-matrix-image-filters";
import { app_colors } from "../../helpers/constants";

export const objectDetailsStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 20,

    title: {
      fontSize: 35,
      fontFamily: 'GilroyBlack',
      color: app_colors.white,
      textAlign: 'center' as 'center',
    },
    
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'GilroyBlack',
      color: app_colors.white,
      textTransform: 'uppercase' as 'uppercase',
      marginTop: 20,
      marginBottom: 10,
    },

    subtitle: {
      fontSize: 20,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
      textAlign: 'center' as 'center',
    },

    image: {
      width: 150,
      height: 150,
      alignSelf: 'center' as 'center',
    },

    dsoInfos: {
    },

    favouritesContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      gap: 10,
      marginTop: 20,

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: 10,
        backgroundColor: app_colors.white,
        padding: 3,
        borderRadius: 10,
        width: '60%' as '60%',

        image: {
          width: 20,
          height: 20,
          tintColor: app_colors.black,
        },

        text: {
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          color: app_colors.black,
          padding: 5,
          borderRadius: 5,
        }
      }
    }
  },

  dsoValues: {
    marginBottom: 5,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    select: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',


      text: {
        fontSize: 10,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
        padding: 5,
        borderRadius: 5,
      }
    },

    title: {
      fontSize: 12,
      fontFamily: 'AuxMono',
      color: app_colors.white,
      opacity: .5,
    },

    value: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
    },

    chip: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 20,
      width: 130,
      textAlign: 'center' as 'center',
    }
  }
}