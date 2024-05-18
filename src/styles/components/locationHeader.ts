import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const locationHeaderStyles = {
  container: {
    marginTop: 40,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    location: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',

      text: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        marginRight: 5
      },
    
      title: {
        color: app_colors.white,
        opacity: .6,
        textTransform: 'uppercase' as 'uppercase',
      },
      
      value: {
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        fontFamily: 'AuxMono'
      },

      settingsButton: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        backgroundColor: app_colors.white_no_opacity,
        padding: 5,
        borderRadius: 5,

        value: {
          color: app_colors.white,
          textTransform: 'uppercase' as 'uppercase',
          fontFamily: 'AuxMono',
          // fontSize: 12,
        },
      }
    }
  },
  modal: {
    width: Dimensions.get('window').width,
    borderWidth: 1,
    borderTopColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.grey,
    padding: 10,
    position: 'absolute' as 'absolute',
    bottom: 0,
    height: 200,
    
    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      marginBottom: 20,

      title: {
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        fontSize: 18,
        fontFamily: 'AuxMono'
      },

      close: {
        color: app_colors.white,
        fontSize: 20,
      }
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',

      column: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start' as 'flex-start',
        justifyContent: 'center' as 'center',
      },

      text: {
        color: app_colors.white,
        fontSize: 16,
        marginBottom: 5,
      }
    }
  }
}