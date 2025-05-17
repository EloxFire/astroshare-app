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
      paddingBottom: 30,

      topGraph: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        yAxis: {
          display: 'flex' as 'flex',
          flexDirection: 'column' as 'column',
          gap: 10,
          width: 20,
          justifyContent: 'space-between' as 'space-between',
          borderRightWidth: 1,
          borderRightColor: app_colors.white,
          // paddingRight: 8,

          values: {
            color: app_colors.white,
            fontSize: 12,
          }
        },

        dataContainer: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          alignItems: 'flex-end' as 'flex-end',
          // justifyContent: 'space-between' as 'space-between',
          flex: 1,
          gap: 2,
          height: '100%' as '100%',
          // backgroundColor: app_colors.green_forty,
        }
      },

      bottomGraph: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',

        xAxis: {
          display: 'flex' as 'flex',
          flexDirection: 'row' as 'row',
          justifyContent: 'space-between' as 'space-between',
          borderTopWidth: 1,
          borderTopColor: app_colors.white,
          marginLeft: 20,
          // paddingTop: 8,
          // backgroundColor: 'blue',
          gap: 2,

          values: {
            flex: 1,
            color: app_colors.white,
            fontSize: 10,
            transform: [{rotate: '-90deg'}],
            // backgroundColor: 'red',
            marginTop: 10,
            marginLeft: -35,
            textAlign: 'center' as 'center',
          }
        }
      }
    }
  }
}
