import { Dimensions } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const starlinkTrackerStyles = {
  statsContainer:{
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    borderWidth : 1,
    borderColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    
    stats: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      marginTop: 10,
  
      stat: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
        gap: 5,
  
        title: {
          color: app_colors.white,
          fontSize: 12,
          fontFamily: 'GilroyRegular',
          textTransform: 'uppercase' as 'uppercase',
          margin: 0,
          padding: 0,
          lineHeight: 12,
        },
        value: {
          color: app_colors.white,
          fontSize: 16,
          fontFamily: 'AuxMono',
          margin: 0,
          padding: 0,
          lineHeight: 16,
        }
      }
    },
  },
  glviewContainer:{
    borderWidth : 1,
    borderColor: app_colors.white_no_opacity,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,

    glview: {
      width: Dimensions.get('screen').width - 22,
      height: Dimensions.get('screen').width - 20,
      margin: 0,
      padding: 0,
    }
  }
}