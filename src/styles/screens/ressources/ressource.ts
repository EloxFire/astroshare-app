import {app_colors} from "../../../helpers/constants";

export const ressourceStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 20,

    infoBox: {
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,

      imageContainer: {
        width: '100%' as '100%',
        height: 150,
        borderRadius: 10,
        borderBottomWidth: 5,
        borderBottomColor: app_colors.white_no_opacity,

        image:{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }
      },

      body:{
        padding: 10,
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        gap: 10,
      },

      downloadButton: {
        backgroundColor: app_colors.white,
        padding: 10,
        borderRadius: 5,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        margin: 10,

        label: {
          fontFamily: 'GilroyBlack',
        }
      }
    },

    markdownContent:{
      padding: 10,
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 50,
    }
  }
}