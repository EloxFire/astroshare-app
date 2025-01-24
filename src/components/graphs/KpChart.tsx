import React, {useEffect, useState} from 'react';
import {View, Dimensions, ScrollView, Text} from 'react-native';
import {kpIndexGraphStyles} from "../../styles/components/graphs/kpIndex";
import {app_colors} from "../../helpers/constants";
import {getGeomagneticStormInfos} from "../../helpers/scripts/astro/getGeomagneticStormInfos";
import {KpIndexData} from "../../helpers/types/KpIndexData";
import {getKpIndex} from "../../helpers/api/getKpIndex";

interface KpData {
  time_tag: string;
  Kp: string;
  a_running: string;
  station_count: string;
}


const KpChart: React.FC = () => {

  const [data, setData] = useState<KpIndexData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const legendItems = [
    {label: 'G0', color: app_colors.green, textColor: app_colors.black},
    {label: 'G1', color: app_colors.yellow, textColor: app_colors.black},
    {label: 'G2', color: app_colors.orange, textColor: app_colors.black},
    {label: 'G3', color: app_colors.darkorange, textColor: app_colors.black},
    {label: 'G4', color: app_colors.red, textColor: app_colors.black},
    {label: 'G5', color: app_colors.violet, textColor: app_colors.black},
  ]

  const KpChartTimes = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "00:00"];

  useEffect(() => {
    console.log("Fetching Kp Indexes...");

    const fetchKpData = async () => {
      try {
        const KpData: KpIndexData[] = await getKpIndex();
        const dummyData: KpIndexData[] = [];
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // Date du jour à 00h00

        for (let i = 0; i < 9; i++) {
          const time = new Date(todayMidnight);
          time.setHours(time.getHours() + i * 3);

          dummyData.push({
            time_tag: time.toISOString(),
            Kp: 0,
            a_running: 0,
            station_count: 0,
          });
        }

        const usedDummyData: KpIndexData[] = dummyData.slice(KpData.length)

        const fullData: KpIndexData[] = KpData.concat(usedDummyData);

        // console.log("Full data : ", fullData);
        setData(fullData.splice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données Kp Index :", error);
      }
    };

    fetchKpData()
  }, []);


  return (
    <View>
      {
        !loading ? (
          <>
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
                      <View key={"label-key" + index} style={itemStyles.container}>
                        <Text style={itemStyles.text}>{item.label}</Text>
                      </View>
                    )
                  })
                }
              </View>
              <View style={kpIndexGraphStyles.container.graph}>
                <View style={kpIndexGraphStyles.container.graph.topGraph}>
                  <View style={kpIndexGraphStyles.container.graph.topGraph.yAxis}>
                    {
                      Array.from({length: 10}).map((_, index) => {
                        return (
                          <Text style={kpIndexGraphStyles.container.graph.topGraph.yAxis.values} key={"scale-key-" + index}>{9 - index}</Text>
                        )
                      })
                    }
                  </View>
                  <View style={kpIndexGraphStyles.container.graph.topGraph.dataContainer}>
                    {
                      data.map((item, index) => {
                        return (
                          <>
                            <View key={"value-key-" + index} style={{flex:1, height: `${(item.Kp / 9) * 100}%`, backgroundColor: getGeomagneticStormInfos(item.Kp).color}}>
                              <Text style={[kpIndexGraphStyles.container.graph.topGraph.yAxis.values, {color: app_colors.black, textAlign: 'center'}]}>{item.Kp}</Text>
                            </View>
                          </>
                        )
                      })
                    }
                  </View>
                </View>
                <View style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis}>
                  {
                    KpChartTimes.map((item, index) => {
                      return (
                        <Text style={kpIndexGraphStyles.container.graph.bottomGraph.xAxis.values} key={"time-key-" + index}>{item}</Text>
                      )
                    })
                  }
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )
      }
    </View>
  );
};

export default KpChart;