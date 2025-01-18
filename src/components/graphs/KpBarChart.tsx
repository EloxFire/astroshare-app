import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import {BarChart} from "react-native-gifted-charts";

interface KpData {
  time_tag: string;
  Kp: string;
  a_running: string;
  station_count: string;
}

interface KpIndexChartProps {
  data: any;
}

const KpBarChart: React.FC<KpIndexChartProps> = ({ data }) => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const PADDING = 20;
  const WIDTH = SCREEN_WIDTH - (PADDING * 5);
  console.log(WIDTH)
  const HEIGHT = 300;


  return (
    <BarChart
      width={WIDTH}
      adjustToWidth
      data={data}
      rulesType={"solid"}
      maxValue={100}
      xAxisColor={"#FFF"}
      yAxisColor={"#FFF"}
      frontColor={"#FFF"}
      yAxisTextStyle={{color: "#FFF"}}
    />
  );
};

export default KpBarChart;