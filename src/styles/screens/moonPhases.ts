import { app_colors } from "../../helpers/constants";
import { Dimensions } from "react-native";

export const moonPhasesStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
    gap: 20,
    backgroundColor: app_colors.white_no_opacity,
    borderColor: app_colors.white_twenty,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 80,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      transitCard: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',

        icon: {
          width: 30,
          height: 30,
          resizeMode: 'contain' as 'contain'
        },

        text: {
          marginTop: 5,
          fontSize: 15,
          fontFamily: 'DMMonoMedium',
          color: app_colors.white,
          textAlign: 'center' as 'center'
        },

        date: {
          fontSize: 16,
          fontFamily: 'DMMonoMedium',
          color: app_colors.white,
          textAlign: 'center' as 'center',
          textTransform: 'uppercase' as 'uppercase'
        }
      }
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: 10,

      moon: {
        width: 210,
        height: 210,
        borderRadius: 105, // Pour avoir un cercle
        backgroundColor: 'white', // Ajuste selon le design
        shadowColor: 'black',
        shadowOffset: { width: 3, height: 0 }, // Ombre vers la droite
        shadowOpacity: 0.5, // Ajuste la transparence
        shadowRadius: 5, // Effet de flou
        elevation: 5, // Pour Android
      },

      phaseTitle: {
        fontSize: 24,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textAlign: 'center' as 'center',
        textTransform: 'uppercase' as 'uppercase'
      },

      icon: {
        width: Dimensions.get('window').width - 100,
        height: Dimensions.get('window').width - 100,
        resizeMode: 'contain' as 'contain',
        alignSelf: 'center' as 'center',
        borderRadius: 210
      },

      infos: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-evenly' as 'space-evenly',
        alignItems: 'center' as 'center',
        marginTop: 20,

        info: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          alignItems: 'center' as 'center',

          label: {
            fontSize: 10,
            opacity: 0.5,
            fontFamily: 'DMMonoRegular',
            color: app_colors.white,
            // textAlign: 'center' as 'center'
          },

          value: {
            fontSize: 20,
            fontFamily: 'GilroyBlack',
            color: app_colors.white,
            // textAlign: 'center' as 'center'
          }
        }
      }
    },

    footer: {
    }
  }
}
