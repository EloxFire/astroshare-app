import {Dimensions} from "react-native";
import {app_colors} from "../../../helpers/constants";

export const conjunctionCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').height / 1.5,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    marginRight: 25,
    padding: 10,

    text: {
      color: app_colors.white,
      fontSize: 16,
      fontFamily: 'GilroyRegular',
    },

    header: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.white_twenty,
      paddingBottom: 10,

      title: {
        color: app_colors.white,
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        textAlign: 'center' as 'center',
        textTransform: 'uppercase' as 'uppercase',
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 15,
        fontFamily: 'AuxMono',
        textAlign: 'center' as 'center',
        opacity: 0.5,
      },
    },

    body: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginBottom: 20,

      planetariumRedirect:{
        marginVertical: 10,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.white,
        borderRadius: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,

        text: {
          color: app_colors.black,
          fontSize: 16,
          fontFamily: 'GilroyRegular',
          textAlign: 'center' as 'center',
        }
      },

      images: {
        marginTop: 10,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        gap: 30,

        image: {
          width: 85,
          height: 85,
        }
      },

      subtitle: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: 'AuxMono',
        textAlign: 'center' as 'center',
        marginTop: 10,
      }
    }
  }
}