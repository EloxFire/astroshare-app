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
          width: 25,
          height: 25,
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

      phaseTitle: {
        fontSize: 24,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textAlign: 'center' as 'center',
        textTransform: 'uppercase' as 'uppercase'
      },

      image: {
        width: Dimensions.get('window').width - 100,
        height: Dimensions.get('window').width - 100,
        resizeMode: 'contain' as 'contain',
        alignSelf: 'center' as 'center',
      },

      infos: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-evenly' as 'space-evenly',
        alignItems: 'center' as 'center',

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

    calendar: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      title: {
        fontSize: 20,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textAlign: 'center' as 'center',
        textTransform: 'uppercase' as 'uppercase'
      },

      selectorRow: {
        display: "flex" as "flex",
        flexDirection: "row" as "row",
        justifyContent: "center" as "center",
        alignItems: "center" as "center",
        gap: 20,

        currentMonth: {
          fontSize: 20,
          fontFamily: 'DMMonoMedium',
          color: app_colors.white,
          textAlign: 'center' as 'center',
        }
      },

      calendarCellsContainer: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        flexWrap: 'wrap' as 'wrap',
        gap: 5,

        cell: {
          width: (Dimensions.get('window').width + 30) / 5,
          height: 120,
          borderRadius: 5,
          backgroundColor: app_colors.white_no_opacity,
          borderColor: app_colors.white_twenty,
          borderWidth: 1,
          display: 'flex' as 'flex',
          justifyContent: 'center' as 'center',
          alignItems: 'center' as 'center',

          day: {
            fontSize: 10,
            fontFamily: 'DMMonoRegular',
            color: app_colors.white
          },

          text: {

          },

          image: {
            width: 80,
            height: 80,
          }
        }
      }
    }
  }
}
