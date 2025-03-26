import { app_colors } from "../../../helpers/constants";
import {Dimensions, StatusBar} from "react-native";

export const sellScreenStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginBottom: 80,
    paddingTop: 50,

    highlightTitle: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      marginTop: 20,
    },

    highlightFeatures: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginTop: 10,
    },

    title: {
      color: app_colors.white,
      fontSize: 35,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white,
      fontSize: 16,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
    },

    description: {
      color: app_colors.white,
      fontSize: 16,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      opacity: .5,
      textAlign: 'center' as 'center',
      marginTop: 30,
    },

    offers: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginTop: 20,

      offerCard: {
        backgroundColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,

        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'flex-start' as 'flex-start',
        justifyContent: 'space-between' as 'space-between',

        title: {
          color: app_colors.white,
          fontSize: 18,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
        },

        price: {
          color: app_colors.white,
          fontSize: 16,
          fontFamily: 'DMMonoMedium' as 'DMMonoMedium',
        },

        discount: {
          // position: 'absolute' as 'absolute',
          // top: -25,
          color: app_colors.black,
          fontSize: 14,
          fontFamily: 'GilroyBlack' as 'GilroyBlack',
          backgroundColor: app_colors.yellow,
          paddingVertical: 2,
          paddingHorizontal: 5,
          borderRadius: 5,
        },

        selected: {
          width: 15,
          height: 15,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: app_colors.white_twenty,
        }
      }
    }
  },

  backgroundImage: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 4 + 10,
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