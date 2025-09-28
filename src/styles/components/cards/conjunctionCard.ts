import {Dimensions} from "react-native";
import {app_colors} from "../../../helpers/constants";

export const conjunctionCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    width: Dimensions.get('window').width - 20,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    marginRight: 25,
    padding: 10,

    title: {
      fontFamily: 'GilroyBlack',
      fontSize: 18,
      color: app_colors.white,
      textTransform: 'uppercase' as 'uppercase',
    }
  }
}
