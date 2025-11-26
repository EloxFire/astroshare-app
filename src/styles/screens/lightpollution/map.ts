import { Dimensions, StatusBar } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const lightPollutionMapStyles = {
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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

      infoBox: {
        backgroundColor: app_colors.black_skymap,
        padding: 10,
        borderRadius: 8,
        maxWidth: Dimensions.get('window').width * 0.7,

        title: {
          fontSize: 16,
          fontWeight: "bold" as "bold",
          color: app_colors.white,
          marginBottom: 5,
        },
      },

      buttons: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
        gap: 10,
  
        button: {
          backgroundColor: app_colors.black_skymap,
          padding: 10,
          borderRadius: 8,
    
          icon: {
            width: 24,
            height: 24,
            tintColor: app_colors.white,
          }
        }
      }
    }
  },
}