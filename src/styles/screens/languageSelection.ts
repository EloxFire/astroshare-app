import { app_colors } from "../../helpers/constants";

export const languageSelectionStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'center' as 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,

    button: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,

      text: {
        color: app_colors.black,
        fontSize: 25,
      }
    }
  }
}