import {app_colors} from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const kpIndexGraphStyles = {
  container: {
    // backgroundColor: app_colors.red_eighty,
    width: Dimensions.get('window').width - 40,

    legend: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
    },

    graph: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      marginTop: 10,
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      padding: 10,

      topGraph: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        yAxis: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          gap: 10,
          justifyContent: 'space-between' as 'space-between',
          borderRightWidth: 1,
          borderRightColor: app_colors.white,
          paddingRight: 10,
          // backgroundColor: app_colors.red_eighty,

          values: {
            color: app_colors.white,
            fontSize: 12,
          }
        },

        dataContainer: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          alignItems: 'flex-end' as 'flex-end',
          justifyContent: 'space-between' as 'space-between',
          gap: 10,
          flex: 1,
          height: '100%' as '100%',
          // backgroundColor: app_colors.green_forty,
          paddingLeft: 10,
        }
      },

      bottomGraph: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',

        xAxis: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          justifyContent: 'space-between' as 'space-between',
          paddingLeft: 30,

          values: {
            color: app_colors.white,
            fontSize: 10,
          }
        }
      }
    }
  }
}