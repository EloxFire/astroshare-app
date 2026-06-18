import { app_colors } from '../../../../helpers/constants';

export const observatoryCardStyles = {
  card: {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_no_opacity,
    padding: 12,

    active: {
      borderColor: app_colors.white,
    },

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',

      left: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        flex: 1,
        gap: 10,
      },

      icon: {
        width: 20,
        height: 20,
      },

      title: {
        color: app_colors.white,
        fontSize: 16,
        fontFamily: 'GilroyBlack' as 'GilroyBlack',
        flex: 1,
      },

      actions: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        gap: 8,
      },

      actionIcon: {
        width: 20,
        height: 20,
      },
    },

    coords: {
      color: app_colors.white_sixty,
      fontSize: 11,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      marginTop: 4,
    },

    amenities: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
      gap: 6,
      marginTop: 8,
    },

    amenityChip: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 4,
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 3,

      icon: {
        width: 12,
        height: 12,
      },

      text: {
        color: app_colors.white_sixty,
        fontSize: 10,
        fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      },
    },
  },
};
