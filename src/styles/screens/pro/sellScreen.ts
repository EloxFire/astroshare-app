import { app_colors } from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const sellScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    paddingTop: 50,

    title: {
      color: app_colors.white,
      fontSize: 35,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
    },

    description: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      marginTop: 30,
    },

    features: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      title: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyRegular' as 'GilroyRegular',
        marginTop: 30,
        marginBottom: 10,
      }
    },

    offers: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center' as 'center',
      marginTop: 40,
      gap: 10,

      offerCard: {
        width: Dimensions.get('window').width - 20,
        height: 60,
        backgroundColor: app_colors.white_no_opacity,
        borderRadius: 10,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        discountBadge:{
          backgroundColor: app_colors.red,
          color: app_colors.white,
          padding: 5,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          fontSize: 10,
        },

        leftContainer: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          alignItems: 'center' as 'center',
          justifyContent: 'center' as 'center',
          width: '25%' as '25%',
        },

        rightContainer: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          paddingLeft: 30,
          flex: 1,
          justifyContent: 'center' as 'center',

          offerName: {
            color: app_colors.white,
            opacity: .5,
            fontSize: 12,
            fontFamily: 'GilroyRegular' as 'GilroyRegular',
          },

          offerPrice: {
            color: app_colors.white,
            fontSize: 25,
            fontFamily: 'GilroyBlack' as 'GilroyBlack',
          }
        }
      }
    }
  },

  backgroundImage: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 4,
    zIndex: -1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    filter:{
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height / 4,
    }
  }
}