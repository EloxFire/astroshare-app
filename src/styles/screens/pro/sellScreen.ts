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

    descriptionLead: {
      color: app_colors.white,
      fontSize: 17,
      fontFamily: 'GilroyMedium' as 'GilroyMedium',
      textAlign: 'left' as 'left',
      marginTop: 60,
      lineHeight: 22,
    },

    description: {
      color: app_colors.white,
      fontSize: 14,
      fontFamily: 'GilroyRegular' as 'GilroyRegular',
      opacity: .55,
      textAlign: 'left' as 'left',
      marginTop: 6,
      lineHeight: 19,
    },

    offers: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginTop: 20,

      offerCard: {
        backgroundColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 12,

        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'space-between' as 'space-between',

        title: {
          color: app_colors.white,
          fontSize: 15,
          fontFamily: 'GilroyMedium' as 'GilroyMedium',
          flexShrink: 1,
        },

        price: {
          color: app_colors.white,
          fontSize: 14,
          fontFamily: 'DMMonoMedium' as 'DMMonoMedium',
          flexShrink: 0,
        },

        highlight: {
          color: app_colors.yellow,
          fontSize: 11,
          fontFamily: 'GilroyMedium' as 'GilroyMedium',
          borderWidth: 1,
          borderColor: app_colors.yellow,
          paddingVertical: 2,
          paddingHorizontal: 6,
          borderRadius: 20,
          overflow: 'hidden' as 'hidden',
        },

        selected: {
          width: 14,
          height: 14,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: app_colors.white_forty,
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