import { app_colors } from "../../../helpers/constants";

const cardBase = {
  borderRadius: 14,
  borderWidth: 1,
  borderColor: app_colors.white_no_opacity,
  backgroundColor: app_colors.white_no_opacity,
  padding: 10,
};

export const checklistsHomeStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    paddingBottom: 90,
  },

  loading: {
    color: app_colors.white_sixty,
    fontFamily: 'GilroyRegular',
    fontSize: 14,
    textAlign: 'center' as 'center',
    marginTop: 20,
  },

  creationCard: {
    ...cardBase,

    title: {
      color: app_colors.white,
      fontSize: 18,
      fontFamily: 'GilroyBlack' as 'GilroyBlack',
      textTransform: 'uppercase' as 'uppercase',
    },

    subtitle: {
      color: app_colors.white_sixty,
      fontSize: 12,
      fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
      marginBottom: 10,
    },

    input: {
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 8,
    },
  },

  card: {
    ...cardBase,
    gap: 12,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'flex-start' as 'flex-start',
      gap: 10,

      meta: {
        flex: 1,
        gap: 2,

        title: {
          color: app_colors.white,
          fontSize: 18,
          fontFamily: 'GilroyBlack',
        },

        description: {
          color: app_colors.white_sixty,
          fontSize: 13,
          fontFamily: 'GilroyRegular',
          marginTop: 2,
        },

        progress: {
          color: app_colors.white_eighty,
          fontSize: 12,
          fontFamily: 'DMMonoRegular',
          marginTop: 8,
        },
      },

      actions: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        gap: 8,

        toggle: {
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: app_colors.white_twenty,
          backgroundColor: app_colors.black,
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          alignItems: 'center' as 'center',
          gap: 6,

          text: {
            color: app_colors.white,
            fontFamily: 'GilroyRegular',
            fontSize: 12,
            letterSpacing: 0.3,
          },

          icon: {
            width: 16,
            height: 16,
            tintColor: app_colors.white,
          },
        },
      },

      deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: app_colors.black_ten,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',

        icon: {
          width: 18,
          height: 18,
          tintColor: app_colors.red_eighty,
        },
      },
    },
  },

  items: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: app_colors.white_twenty,
    paddingTop: 10,

    empty: {
      color: app_colors.white_sixty,
      fontFamily: 'GilroyRegular',
      fontSize: 13,
    },

    row: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 10,
    },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: app_colors.black,

      completed: {
        backgroundColor: app_colors.green_forty,
        borderColor: app_colors.green,
      },

      icon: {
        width: 14,
        height: 14,
        tintColor: app_colors.white,
      },
    },

    text: {
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      fontSize: 15,
      flex: 1,

      completed: {
        textDecorationLine: 'line-through' as 'line-through',
        color: app_colors.white_sixty,
      },
    },

    remove: {
      padding: 6,

      icon: {
        width: 18,
        height: 18,
        tintColor: app_colors.red_eighty,
      },
    },
  },

  addItem: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',

    input: {
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      color: app_colors.white,
      fontFamily: 'GilroyRegular',
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
  },
};
