import {app_colors} from "../../../helpers/constants";

export const launchDetailsStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    paddingBottom: 50,
    gap: 20,

    mainCard: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',

      thumbnail: {
        width: '100%' as '100%',
        aspectRatio: 16 / 9,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        backgroundColor: app_colors.white_no_opacity,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: app_colors.white_no_opacity,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 10,

        title: {
          fontSize: 22,
          fontFamily: 'GilroyBlack',
          color: app_colors.white,
          textTransform: 'uppercase' as 'uppercase',
        },

        subtitleContainer:{
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          // marginBottom: 20,

          subtitle: {
            fontSize: 16,
            fontFamily: 'GilroyBlack',
            color: app_colors.white,
          },

          subtitle_text: {
            fontSize: 16,
            fontFamily: 'GilroyRegular',
            color: app_colors.white,
          }
        },

        statusContainer:{
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          borderTopWidth: 1,
          borderColor: app_colors.white_no_opacity,
          marginTop: 20,
          paddingTop: 10,
        }
      }
    },

    programCard: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,

      title: {
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        borderBottomWidth: 1,
        borderColor: app_colors.white_no_opacity,
        paddingBottom: 5,
        marginBottom: 10,
      },

      subtitle: {
        fontSize: 16,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        marginTop: 10,
        marginBottom: 5,
      },

      description: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
        textAlign: 'justify' as 'justify',
      }
    },

    missionCard: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,

      title: {
        fontSize: 18,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        borderBottomWidth: 1,
        borderColor: app_colors.white_no_opacity,
        paddingBottom: 5,
        marginBottom: 10,
      },

      subtitle: {
        fontSize: 16,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
        marginTop: 10,
        marginBottom: 5,
      },

      description: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
        textAlign: 'justify' as 'justify',
      }
    },

    notificationButtonContainer: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      gap: 10,
      marginTop: 10,

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: 10,
        backgroundColor: app_colors.white,
        padding: 3,
        borderRadius: 10,
        width: '60%' as '60%',

        image: {
          width: 20,
          height: 20,
          tintColor: app_colors.black,
        },

        text: {
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          color: app_colors.black,
          padding: 5,
          borderRadius: 5,
        }
      }
    }
  }
}