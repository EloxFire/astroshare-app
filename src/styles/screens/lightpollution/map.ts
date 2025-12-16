import { Dimensions, StatusBar } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const lightPollutionMapStyles = {
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legend: {
    container: {
      backgroundColor: app_colors.black,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      paddingHorizontal: 12,
      paddingVertical: 5,
      gap: 3,
      width: Dimensions.get('window').width - 20,
      borderRadius: 15,
    },
    header: {
      flexDirection: "row" as "row",
      justifyContent: "space-between" as "space-between",
      alignItems: "center" as "center",
      
      title: {
        fontSize: 14,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
        textTransform: 'uppercase' as 'uppercase',
      },
      subtitle: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white_sixty,
      },
    },
    scaleRow: {
      flexDirection: "row" as "row",
      overflow: "hidden" as "hidden",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      
      scaleBlock: {
        flex: 1,
        height: 14,
      },
      scaleLabels: {
        flexDirection: "row" as "row",
        justifyContent: "space-between" as "space-between",
      },
      
      scaleLabel: {
        fontSize: 10,
        fontFamily: 'GilroyRegular',
        color: app_colors.white,
      },
    },
    list: {
      gap: 8,
      
      listItem: {
        flexDirection: "row" as "row",
        alignItems: "center" as "center",
        gap: 10,
      },
      listColor: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
      },
      listTexts: {
        flexShrink: 1,
        gap: 2,
      },
      listTitle: {
        fontSize: 14,
        fontFamily: 'GilroyBlack',
        color: app_colors.white,
      },
      listSubtitle: {
        fontSize: 12,
        fontFamily: 'GilroyRegular',
        color: app_colors.white_sixty,
      },
      unit: {
        fontSize: 14,
        fontFamily: 'GilroyRegular',
        color: app_colors.white_sixty,
        textAlign: "right" as "right",
      },
    },
  },

  controlsContainer: {
    position: "absolute" as "absolute",
    // backgroundColor: app_colors.blue_eighty,
    top: 0,
    padding: 5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingTop: 150,
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    alignItems: "flex-end" as "flex-end",
    gap: 10,

    header: {
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      justifyContent: "space-between" as "space-between",
      alignItems: "flex-start" as "flex-start",
      width: "100%" as "100%",

      searchInput:{
        backgroundColor: app_colors.black,
        borderWidth: 1,
        borderColor: app_colors.white_twenty,
        width: Dimensions.get('window').width - 180,
        marginRight: 10,
        marginTop: 0,
        height: 45,
      },

      infoBox: {
        backgroundColor: app_colors.black,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        width: Dimensions.get('window').width - 180,
        borderColor: app_colors.white_twenty,

        title: {
          fontSize: 22,
          fontFamily: 'GilroyBlack',
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white,
          marginTop: 5,
        },

        subtitle: {
          fontSize: 14,
          fontFamily: 'GilroyRegular',
          color: app_colors.white,
        },

        source: {
          fontSize: 12,
          fontFamily: 'GilroyRegular',
          color: app_colors.white_forty,
          marginTop: 5,
        }
      },

      buttons: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
        gap: 10,
  
        button: {
          backgroundColor: app_colors.black,
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: app_colors.white_twenty,

          icon: {
            width: 24,
            height: 24,
            tintColor: app_colors.white,
          }
        }
      }
    },

    footer: {
      position: "absolute" as "absolute",
      bottom: 10,
      width: Dimensions.get('window').width,
      display: "flex" as "flex",
      flexDirection: "row" as "row",
      justifyContent: "center" as "center",
      padding: 5,
      borderRadius: 8,
      left: 0,
    }
  },
}
