import { app_colors } from "../../../helpers/constants";
import {Dimensions, StatusBar} from "react-native";

export const sellScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginBottom: 80,
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
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      marginTop: 40,
      gap: 10,

      button: {
        backgroundColor: app_colors.white,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,

        text:{
          textAlign: 'center' as 'center',
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          fontSize: 16,
          color: app_colors.black,
        }
      },

      offerCard: {
        position: 'relative' as 'relative',
        padding: 10,
        paddingTop: 25,
        width: (Dimensions.get('window').width / 2) - 20,
        height: 200,
        backgroundColor: app_colors.white_no_opacity,
        borderRadius: 10,
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between' as 'space-between',
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        discountBadge: {
          position: 'absolute' as 'absolute',
          right: 0,
          backgroundColor: app_colors.red,
          color: app_colors.white,
          padding: 5,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          fontSize: 10,
        },
        offerName: {
          color: app_colors.white,
          opacity: .5,
          fontSize: 12,
          fontFamily: 'GilroyRegular' as 'GilroyRegular',
        },

        offerPrice: {
          color: app_colors.white,
          fontSize: 35,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
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

    bgFilter:{
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height / 4,
    }
  }
}