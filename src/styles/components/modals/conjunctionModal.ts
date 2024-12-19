import {Dimensions} from "react-native";
import {app_colors} from "../../../helpers/constants";

export const conjunctionModalStyles = {
  modal:{
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: app_colors.black_modal,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    zIndex: 100,

    content: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center' as 'center',
      // alignItems: 'center' as 'center',
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      padding: 10,
      width: Dimensions.get('screen').width - 20,

      block: {
        marginBottom: 20,
      },

      text: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
      },

      closeButton: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'flex-end' as 'flex-end',
        alignItems: 'center' as 'center',

        icon: {
          width: 30,
          height: 30,
          transform: [{rotate: '45deg'}],
        }
      },

      fieldTitle: {
        fontSize: 16,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },

      row:{
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        gap: 10,
        paddingTop: 10,
      },

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.white_no_opacity,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        gap: 5,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        text: {
          fontSize: 14,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
        }
      },

      datePicker: {
        backgroundColor: app_colors.white_no_opacity,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: app_colors.white_no_opacity,
        borderWidth: 1,
        alignSelf: 'center' as 'center',

        text: {
          fontFamily: 'GilroyRegular',
          fontSize: 16,
          color: app_colors.white,
          textAlign: 'center' as 'center'
        }
      },
    }
  }
}