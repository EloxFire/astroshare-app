import { app_colors } from "../../helpers/constants";

export const tutorialStyles = {
  content: {
    flex: 1,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
    paddingBottom: 20,

    screen: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'flex-start' as 'flex-start',
      flex: 1,

      title: {
        fontSize: 20,
        color: app_colors.white,
        fontFamily: 'GilroyBlack',
        textTransform: 'uppercase' as 'uppercase',
        alignSelf: 'center' as 'center',
      },

      subtitle: {
        fontSize: 12,
        color: app_colors.white,
        fontFamily: 'DMMonoRegular',
        opacity: 0.8,
        alignSelf: 'center' as 'center',
        marginBottom: 20,
      },

      imageContainer: {
        backgroundColor: app_colors.white_no_opacity,
        borderColor: app_colors.white_no_opacity,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        
        image: {
          width: '100%' as '100%',
          height: 300,
        },
      },

      description: {
        fontSize: 16,
        color: app_colors.white,
        fontFamily: 'GilroyRegular',
        textAlign: 'left' as 'left',
        marginBottom: 10,
      }
    },

    bottomBar: {
      height: 100,
      width: '100%' as '100%',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      dots: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        dot: {
          width: 10,
          height: 10,
          borderRadius: 10,
          marginHorizontal: 3,
          marginVertical: 3,
        }
      }
    }
  },
}