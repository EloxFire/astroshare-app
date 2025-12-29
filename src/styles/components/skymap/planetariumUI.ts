import {app_colors} from "../../../helpers/constants";
import {Dimensions, StatusBar} from "react-native";


const DEFAULT_UI_BUTTON_SIZE = 50;
const DEFAULT_UI_BUTTON_PADDING = 10;
const DEFAULT_UI_BUTTON_BORDER_RADIUS = 10;
const DEFAULT_UI_BUTTON_GAP = 10;

export const planetariumUIStyles = {
  container: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    height: "100%" as "100%",
    width: "100%" as "100%",
    zIndex: 10,
    paddingHorizontal: 10,

    layersModal: {
      backgroundColor: app_colors.black_skymap,
      padding: 10,
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight! + DEFAULT_UI_BUTTON_GAP,
      right: 65,
      zIndex: 10,
      width: 200,
      gap: 10,
      display: 'flex' as 'flex',
      borderRadius: 10,
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      flexWrap: 'wrap' as 'wrap',
      borderWidth: 1,
      borderColor: app_colors.white_twenty,

      button: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: 5,
        width: 50,
        height: 50,

        icon: {
          width: 30,
          height: 30,
          tintColor: app_colors.white_sixty,
        },

        text: {
          color: app_colors.white_sixty,
          fontFamily: 'GilroyRegular',
          fontSize: 10
        }
      }
    },

    uiButton: {
      position: 'absolute' as 'absolute',
      top: StatusBar.currentHeight!,
      right: 10,
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      zIndex: 10,
      backgroundColor: app_colors.black_skymap,
      padding: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,

      text: {
        color: app_colors.white,
        fontSize: 15
      },

      icon: {
        width: 30,
        height: 30,
        tintColor: app_colors.white_sixty,
      }
    },

    buttons: {
      back: {
        left: 10,
        right: 'auto' as 'auto',
        // zIndex: 10000,
      },

      search: {
        top: StatusBar.currentHeight! + DEFAULT_UI_BUTTON_SIZE + DEFAULT_UI_BUTTON_GAP,
      },

      timeline: {
        top: StatusBar.currentHeight! + (DEFAULT_UI_BUTTON_SIZE + DEFAULT_UI_BUTTON_GAP) * 2,
      }
    },

    searchContainer: {
      position: 'absolute' as 'absolute',
      // top: StatusBar.currentHeight! + DEFAULT_UI_BUTTON_SIZE * 2 + DEFAULT_UI_BUTTON_PADDING * 2 + DEFAULT_UI_BUTTON_GAP,
      top: StatusBar.currentHeight! + DEFAULT_UI_BUTTON_SIZE + DEFAULT_UI_BUTTON_PADDING + DEFAULT_UI_BUTTON_GAP,
      right: Dimensions.get('window').width / 2 - ((Dimensions.get('window').width - 20) / 2),
      zIndex: 9,
      width: Dimensions.get('window').width - 20,

      input: {
        backgroundColor: app_colors.black_skymap,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        padding: 10,
        color: app_colors.white,
        fontSize: 15,
        fontFamily: 'GilroyRegular',
        height: 50,
        width: (Dimensions.get('window').width - 20) - DEFAULT_UI_BUTTON_SIZE - DEFAULT_UI_BUTTON_PADDING,
      },

      results: {
        backgroundColor: app_colors.black_skymap,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        marginTop: 10,
        height: 200,
      },

      categories: {
        backgroundColor: app_colors.black_skymap,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        marginTop: 10,

        separator: {
          backgroundColor: app_colors.white_twenty,
          height: 1
        },

        category: {
          padding: 10,
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          justifyContent: 'space-between' as 'space-between',
          alignItems: 'center' as 'center',

          text: {
            color: app_colors.white_sixty,
            fontSize: 15,
            fontFamily: 'GilroyRegular',
          },

          icon: {
            width: 30,
            height: 30,
            tintColor: app_colors.white_sixty,
          }
        }
      }
    },

    timelineModal: {
      overlay: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 12,
        justifyContent: 'flex-end' as 'flex-end',
        alignItems: 'center' as 'center',
        padding: 20,
        // backgroundColor: app_colors.b
      },

      compactCard: {
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'space-between' as 'space-between',
        width: '100%' as '100%',
        gap: 20,
        backgroundColor: app_colors.black_skymap,
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
      },

      column: {
        alignItems: 'center' as 'center',
        gap: 6,
      },

      arrowRow: {
        flexDirection: 'row' as 'row',
        gap: 8,
        alignItems: 'center' as 'center',
      },

      chevronButton: {
        padding: 6,
      },

      chevron: {
        width: 18,
        height: 18,
        tintColor: app_colors.white,
      },

      value: {
        color: app_colors.white,
        fontSize: 20,
        fontFamily: 'DMMonoRegular',
      },

      centerColumn: {
        alignItems: 'center' as 'center',
        gap: 10,
      },

      iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
      },

      centerIcon: {
        width: 20,
        height: 20,
        tintColor: app_colors.white,
      },

      closeButton: {
        marginTop: 12,
      },

      closeIcon: {
        width: 26,
        height: 26,
        tintColor: app_colors.white_sixty,
      },
    },

    generalInfosBar: {
      position: 'absolute' as 'absolute',
      bottom: 25,
      left: 10,
      right: 10,
      zIndex: 10,

      header: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        clock: {
          color: app_colors.white_eighty,
          fontSize: 30,
          fontFamily: 'GilroyBlack',
          lineHeight: 30
        },

        location: {
          color: app_colors.white_eighty,
          fontSize: 15,
          fontFamily: 'GilroyRegular',
          lineHeight: 15
        }
      },

      body: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',
        backgroundColor: app_colors.black_skymap,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,

        image: {
          width: 50,
          height: 50,
        },

        title: {
          color: app_colors.white,
          fontSize: 20,
          fontFamily: 'GilroyBlack'
        },

        subtitle: {
          color: app_colors.white,
          fontSize: 12,
          fontFamily: 'DMMonoRegular',
        }
      }
    }
  }
}
