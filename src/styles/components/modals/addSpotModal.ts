import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const addSpotModalStyles = {
  modal: {
    position: 'absolute' as 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    zIndex: 1000,

    content: {
      backgroundColor: app_colors.white_no_opacity,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_no_opacity,
      width: '90%' as '90%',
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',


      header: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        marginBottom: 20,
        
        title: {
          color: app_colors.white,
          fontSize: 20,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          marginBottom: 10,
        },
        
        icon: {
          width: 30,
          height: 30,
        }
      },
      
      text: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyMedium',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: app_colors.white_eighty,
        paddingBottom: 30,
      },

      property: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',
        marginBottom: 10,

        row: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          gap: 8,
        },

        text: {
          color: app_colors.white,
          fontSize: 22,
          fontFamily: 'GilroyMedium',
          marginBottom: 10,
        },
        
        icon: {
          width: 40,
          height: 40,
        },

        illustration: {
          width: 22,
          height: 22,
        },

        input: {
          paddingVertical: 5,
          paddingHorizontal: 10,
          color: app_colors.white,
          fontSize: 15,
          backgroundColor: app_colors.white_no_opacity,
          flex: .3,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: app_colors.white_no_opacity,
          height: 35,
        }
      }

    }
  }
}