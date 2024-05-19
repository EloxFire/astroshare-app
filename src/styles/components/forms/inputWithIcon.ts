import { app_colors } from "../../../helpers/constants";

export const inputWithIconStyles = {
  inputContainer: {
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    borderRadius: 10,
    marginVertical: 15,
    height: 40,
    
    inputIcon: {
      marginRight: 5,
      maxHeight: 20,
    },

    input: {
      flex: 1,
      paddingVertical: 5,
      paddingHorizontal: 10,
      color: app_colors.white,
      fontSize: 12
    },
  },
}