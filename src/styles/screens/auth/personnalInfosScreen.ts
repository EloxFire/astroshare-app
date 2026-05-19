import { app_colors } from "../../../helpers/constants";

export const personnalInfosScreenStyles = {
  profilePicturesContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-around' as 'space-around',
    marginTop: 10,

    profilePicture:{
      display: 'flex' as 'flex',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      width: 60,
      height: 60,
      borderRadius: 50,
      margin: 5,
      resizeMode: 'cover' as 'cover',
      borderWidth: 1,
      borderColor: app_colors.white_sixty,
      backgroundColor: app_colors.white_no_opacity,
    },

    defaultIcon: {
      width: 25,
      height: 25,
      resizeMode: 'contain' as 'contain',
    }
  }
}