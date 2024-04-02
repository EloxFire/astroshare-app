import { Dimensions } from "react-native";
import { app_colors } from "../../helpers/constants";

export const locationHeaderStyles = {
  container: {
    marginTop: 10,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',

    location: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
    
      title: {
        color: app_colors.white,
        opacity: .6,
        textTransform: 'uppercase' as 'uppercase',
      },

      value: {
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
      }
    }
  },
  modal: {
    width: Dimensions.get('window').width - 200,
    borderWidth: 1,
    borderColor: app_colors.white,
    backgroundColor: app_colors.black,
    padding: 20,
    borderRadius: 10,
    position: 'absolute' as 'absolute',
    top: Dimensions.get('window').height / 2,
    left: Dimensions.get('window').width / 2,
    transform: [{translateX: -Dimensions.get('window').width / 2 + 100}, {translateY: -Dimensions.get('window').height / 2 + 100}]
  }
}