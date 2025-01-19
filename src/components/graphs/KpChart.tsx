import React from 'react';
import {View, Dimensions, ScrollView, Text} from 'react-native';
import {kpIndexGraphStyles} from "../../styles/components/graphs/kpIndex";
import {app_colors} from "../../helpers/constants";
import {getGeomagneticStormInfos} from "../../helpers/scripts/astro/getGeomagneticStormInfos";
import dayjs from "dayjs";

interface KpData {
  time_tag: string;
  Kp: string;
  a_running: string;
  station_count: string;
}


const KpChart: React.FC = () => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const PADDING = 20;
  const WIDTH = SCREEN_WIDTH - (PADDING * 5);
  const HEIGHT = 300;

  const legendItems = [
    {label: 'G0', color: app_colors.green, textColor: app_colors.black},
    {label: 'G1', color: app_colors.yellow, textColor: app_colors.black},
    {label: 'G2', color: app_colors.orange, textColor: app_colors.black},
    {label: 'G3', color: app_colors.darkorange, textColor: app_colors.black},
    {label: 'G4', color: app_colors.red, textColor: app_colors.black},
    {label: 'G5', color: app_colors.violet, textColor: app_colors.black},
  ]

  const data = [
    {
      time_tag: "2020-01-01 00:00:00",
      Kp: "4",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 03:00:00",
      Kp: "2",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 06:00:00",
      Kp: "2.67",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 09:00:00",
      Kp: "2",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 12:00:00",
      Kp: "2.67",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 15:00:00",
      Kp: "2.33",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 18:00:00",
      Kp: "2.33",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-01 21:00:00",
      Kp: "2.33",
      a_running: "0",
      station_count: "0"
    },
    {
      time_tag: "2020-01-02 00:00:00",
      Kp: "2.33",
      a_running: "0",
      station_count: "0"
    }
  ]


  return (
    <View style={kpIndexGraphStyles.container}>
      <View style={kpIndexGraphStyles.container.legend}>
        {
          legendItems.map((item, index) => {

            const itemStyles = {
              container: {
                display: 'flex' as 'flex',
                flexDirection: 'row' as 'row',
                flex: 1,
              },
              text: {
                color: item.textColor || 'white',
                backgroundColor: item.color,
                flex: 1,
                textAlign: "center" as "center",
                borderTopLeftRadius: index === 0 ? 5 : 0,
                borderBottomLeftRadius: index === 0 ? 5 : 0,
                borderTopRightRadius: index === legendItems.length - 1 ? 5 : 0,
                borderBottomRightRadius: index === legendItems.length - 1 ? 5 : 0,
              }
            }


            return (
              <View key={index} style={itemStyles.container}>
                <Text style={itemStyles.text}>{item.label}</Text>
              </View>
            )
          })
        }
      </View>
      <View style={kpIndexGraphStyles.container.graph}>
        <View style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis}>
          {
            data.map((item, index) => {
              return (
                <Text style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis.values} key={index}>{`${dayjs(item.time_tag).format('D MMM')}`}</Text>
              )
            })
          }
        </View>
        <View style={kpIndexGraphStyles.container.graph.topGraph}>
          <View style={kpIndexGraphStyles.container.graph.topGraph.yAxis}>
          {/* SCALE */}
            {
              Array.from({length: 10}).map((_, index) => {
                return (
                  <Text style={kpIndexGraphStyles.container.graph.topGraph.yAxis.values} key={index}>{9 - index}</Text>
                )
              })
            }
          </View>
          <View style={kpIndexGraphStyles.container.graph.topGraph.dataContainer}>
            {
              data.map((item, index) => {
                return (
                  <View key={index} style={{flex: 1, height: `${(parseFloat(item.Kp) / 9) * 100}%`, backgroundColor: getGeomagneticStormInfos(parseFloat(item.Kp)).color}}>
                    <Text style={[kpIndexGraphStyles.container.graph.topGraph.yAxis.values, {color: app_colors.black, textAlign: 'center'}]}>{item.Kp}</Text>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis}>
          {
            data.map((item, index) => {
              return (
                <Text style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis.values} key={index}>{`${dayjs(item.time_tag).format('HH:mm')}`}</Text>
              )
            })
          }
        </View>
      </View>
    </View>
  );
};

export default KpChart;