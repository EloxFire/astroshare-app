import {Dimensions} from "react-native";
import {app_colors} from "../../../helpers/constants";

export const conjunctionCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    width: Dimensions.get('window').width - 20,
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    marginRight: 25,
    padding: 10,

    datetime: {
      fontFamily: 'GilroyBlack',
      fontSize: 15,
      color: app_colors.white
    }
  }
}
