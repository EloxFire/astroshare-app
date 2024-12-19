import {app_colors} from "../../../helpers/constants";

export const conjunctionCardStyles = {
  card: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,

    images: {
      width: 40,
      height: 40,
    },

    separator:{
      height: 1,
      backgroundColor: app_colors.white_no_opacity,
      marginVertical: 10,
      width: '100%' as '100%',
      alignSelf: 'center' as 'center',
    },

    main:{
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      middle: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',

        title: {
          fontSize: 14,
          fontFamily: 'GilroyBlack',
          color: app_colors.white,
          textTransform: 'uppercase' as 'uppercase',
        },

        subtitle: {
          fontSize: 14,
          fontFamily: 'AuxMono',
          opacity: 0.5,
          color: app_colors.white,
        }
      }
    },

    infos: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      info: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        opacity: 0.5,
        marginVertical: 5,

        icon: {
          width: 20,
          height: 20,
          marginRight: 5,
        },

        text: {
          fontSize: 14,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
        }
      }
    }
  }
}